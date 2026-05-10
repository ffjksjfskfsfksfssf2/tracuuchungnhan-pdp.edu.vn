import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ code: string }>;

export default async function VerifyPage({ params }: { params: Params }) {
  const { code } = await params;

  let result = null as {
    student_code: string;
    full_name: string;
    certificate_title: string | null;
    issue_date: string;
    campaign_title: string;
    signer_name: string | null;
    signer_title: string | null;
    drive_view_url: string | null;
    verification_code: string;
  } | null;

  let envMissing = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("public_verify_certificate", {
      p_code: code,
    });
    if (!error && data && data.length > 0) {
      result = data[0];
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("Missing Supabase env")) {
      envMissing = true;
    } else {
      throw err;
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        Xác minh chứng nhận
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">
        {result ? "Chứng nhận hợp lệ" : "Không tìm thấy chứng nhận"}
      </h1>

      {envMissing ? (
        <p className="text-muted-foreground mt-4">
          Hệ thống chưa được cấu hình. Vui lòng quay lại sau.
        </p>
      ) : null}

      {result ? (
        <Card className="border-pdp-orange/30 mt-6">
          <CardContent className="space-y-3 p-6 text-sm">
            <Row label="Họ và tên" value={result.full_name} />
            <Row label="MSSV" value={result.student_code} />
            <Row
              label="Ngày cấp"
              value={new Date(result.issue_date).toLocaleDateString("vi-VN")}
            />
            <Row
              label="Chương trình"
              value={result.certificate_title ?? result.campaign_title}
            />
            {result.signer_name ? (
              <Row
                label="Đơn vị cấp"
                value={[result.signer_name, result.signer_title]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ) : null}
            <Row
              label="Mã xác thực"
              value={
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {result.verification_code}
                </code>
              }
            />
            {result.drive_view_url ? (
              <div className="pt-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={result.drive_view_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem chứng nhận
                  </a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        !envMissing && (
          <p className="text-muted-foreground mt-4">
            Mã <code>{code}</code> không khớp với chứng nhận nào trong hệ thống.
          </p>
        )
      )}

      <div className="mt-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/">← Trở về trang tra cứu</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="text-muted-foreground sm:w-32 sm:flex-none">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
