import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CampaignStatusBadge } from "@/components/admin/campaign-status-badge";
import { createClient } from "@/lib/supabase/server";
import { CampaignEditForm } from "./edit-form";

export const metadata = { title: "Chiến dịch" };

type Params = Promise<{ campaignId: string }>;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
  timeStyle: "short",
});

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return dateFormatter.format(d);
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Params;
}) {
  const { campaignId } = await params;
  const supabase = await createClient();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(
      "id, title, slug, description, issue_date, signer_name, signer_title, drive_folder_id, status, created_at, updated_at",
    )
    .eq("id", campaignId)
    .maybeSingle();

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Không thể tải chiến dịch: {error.message}
      </div>
    );
  }
  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campaigns"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ChevronLeftIcon className="size-4" aria-hidden />
          Quay lại danh sách
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {campaign.title}
          </h1>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          Tạo lúc {formatDate(campaign.created_at)} · Cập nhật{" "}
          {formatDate(campaign.updated_at)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Chỉnh sửa thông tin</h2>
        </CardHeader>
        <CardContent>
          <CampaignEditForm
            campaignId={campaign.id}
            defaults={{
              title: campaign.title,
              slug: campaign.slug,
              description: campaign.description,
              issue_date: campaign.issue_date,
              signer_name: campaign.signer_name,
              signer_title: campaign.signer_title,
              drive_folder_id: campaign.drive_folder_id,
              status: campaign.status,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
