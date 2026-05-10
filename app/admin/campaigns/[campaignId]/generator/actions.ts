"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  templateConfigSchema,
  type TemplateConfig,
} from "@/lib/generator/template-config";
import {
  certificateBatchSchema,
  type CertificateRecord,
} from "@/lib/validation/certificate-record";
import { stripDiacritics } from "@/lib/utils/normalize";

export type SaveTemplateConfigResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Persist the position config to `campaigns.template_config` so the next
 * batch run can pick up where the admin left off.
 */
export async function saveTemplateConfig(
  campaignId: string,
  config: TemplateConfig,
): Promise<SaveTemplateConfigResult> {
  await requireAdmin();

  const parsed = templateConfigSchema.safeParse(config);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Cấu hình không hợp lệ.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ template_config: parsed.data })
    .eq("id", campaignId);

  if (error) {
    return { ok: false, error: `Không thể lưu cấu hình: ${error.message}` };
  }

  revalidatePath(`/admin/campaigns/${campaignId}`);
  revalidatePath(`/admin/campaigns/${campaignId}/generator`);
  return { ok: true };
}

export type SaveCertificateBatchResult =
  | { ok: true; saved: number; total: number }
  | { ok: false; error: string };

const UPSERT_CHUNK_SIZE = 500;

/**
 * Persist a batch of generated certificates to `certificates`. Upserts on
 * the `(campaign_id, student_code)` unique constraint so re-runs update
 * existing rows instead of failing.
 *
 * Performs the work in chunks to keep payloads small and to give clearer
 * error messages when one chunk fails.
 */
export async function saveCertificateBatch(
  campaignId: string,
  records: CertificateRecord[],
): Promise<SaveCertificateBatchResult> {
  await requireAdmin();

  const parsed = certificateBatchSchema.safeParse(records);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ??
        "Danh sách chứng nhận có dòng không hợp lệ.",
    };
  }

  const supabase = await createClient();

  // Need the campaign's issue_date as a fallback when a row doesn't include
  // its own date. Also confirm the campaign exists / admin has access.
  const { data: campaign, error: campaignErr } = await supabase
    .from("campaigns")
    .select("id, issue_date")
    .eq("id", campaignId)
    .maybeSingle();

  if (campaignErr) {
    return { ok: false, error: campaignErr.message };
  }
  if (!campaign) {
    return { ok: false, error: "Không tìm thấy chiến dịch." };
  }

  const rows = parsed.data.map((r) => ({
    campaign_id: campaignId,
    student_code: r.student_code,
    full_name: r.full_name,
    full_name_normalized: stripDiacritics(r.full_name).toUpperCase(),
    class_name: r.class_name ?? null,
    email: r.email ?? null,
    date_of_birth: r.date_of_birth ?? null,
    certificate_title: r.certificate_title ?? null,
    issue_date: r.issue_date ?? campaign.issue_date,
    file_name: r.file_name,
    verification_code: r.verification_code,
    qr_payload: r.qr_payload,
    metadata:
      r.warnings && r.warnings.length > 0 ? { warnings: r.warnings } : {},
  }));

  let saved = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK_SIZE) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK_SIZE);
    const { error } = await supabase.from("certificates").upsert(chunk, {
      onConflict: "campaign_id,student_code",
      ignoreDuplicates: false,
    });
    if (error) {
      return {
        ok: false,
        error: `Lưu thất bại ở chunk ${i / UPSERT_CHUNK_SIZE + 1}: ${error.message}`,
      };
    }
    saved += chunk.length;
  }

  // Log the batch run.
  await supabase.from("import_batches").insert({
    campaign_id: campaignId,
    original_file_name: null,
    row_count: rows.length,
    success_count: saved,
    error_count: 0,
  });

  revalidatePath(`/admin/campaigns/${campaignId}`);
  revalidatePath(`/admin/campaigns/${campaignId}/certificates`);
  revalidatePath(`/admin/certificates`);
  return { ok: true, saved, total: rows.length };
}
