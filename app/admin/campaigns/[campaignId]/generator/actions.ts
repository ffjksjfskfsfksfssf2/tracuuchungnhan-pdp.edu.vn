"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  templateConfigSchema,
  type TemplateConfig,
} from "@/lib/generator/template-config";

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
