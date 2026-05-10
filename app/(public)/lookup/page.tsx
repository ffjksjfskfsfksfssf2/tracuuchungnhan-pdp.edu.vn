import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LookupForm } from "@/components/public/lookup-form";
import {
  DEFAULT_STUDENT_CODE_PATTERN,
  studentCodeSchema,
} from "@/lib/validation/student-code";
import type { LookupApiResponse } from "@/types/certificate";

type SearchParams = Promise<{ code?: string }>;

export default async function LookupResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { code } = await searchParams;

  if (!code) {
    return <NoCodePrompt />;
  }

  const parsed = studentCodeSchema().safeParse(code);
  if (!parsed.success) {
    return (
      <ResultShell heading="Mã số sinh viên không hợp lệ">
        <p className="text-muted-foreground">
          Định dạng đúng là <code>PSxxxxx</code> (ví dụ <code>PS43995</code>).
          Vui lòng nhập lại.
        </p>
        <LookupForm />
      </ResultShell>
    );
  }

  const studentCode = parsed.data;
  const result = await fetchLookup(studentCode);

  if (!result.ok) {
    return (
      <ResultShell heading="Không tìm thấy chứng nhận">
        <p className="text-muted-foreground">
          Hệ thống không tìm thấy chứng nhận đã công bố cho mã số{" "}
          <strong>{studentCode}</strong>. Vui lòng kiểm tra lại hoặc liên hệ
          phòng PDP.
        </p>
        <LookupForm />
      </ResultShell>
    );
  }

  const cert = result.certificate;
  const issueDate = new Date(cert.issue_date).toLocaleDateString("vi-VN");

  return (
    <ResultShell heading="Đã tìm thấy chứng nhận">
      <Card className="border-pdp-orange/30">
        <CardContent className="space-y-4 p-6">
          <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              Họ và tên
            </p>
            <p className="text-xl font-semibold">{cert.full_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase">MSSV</p>
              <p>{cert.student_code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Ngày cấp
              </p>
              <p>{issueDate}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs uppercase">
                Chương trình
              </p>
              <p>{cert.certificate_title ?? cert.campaign_title}</p>
            </div>
            {cert.signer_name ? (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs uppercase">
                  Đơn vị cấp
                </p>
                <p>
                  {cert.signer_name}
                  {cert.signer_title ? ` · ${cert.signer_title}` : ""}
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {cert.drive_view_url ? (
              <Button asChild variant="outline">
                <a
                  href={cert.drive_view_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem chứng nhận
                </a>
              </Button>
            ) : null}
            {cert.drive_download_url ? (
              <Button
                asChild
                className="bg-pdp-orange hover:bg-pdp-orange/90 text-white"
              >
                <a
                  href={cert.drive_download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tải về (PNG)
                </a>
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground border-border/60 border-t pt-3 text-xs">
            Mã xác thực:{" "}
            <Link
              href={`/verify/${cert.verification_code}`}
              className="hover:underline"
            >
              {cert.verification_code}
            </Link>
          </p>
        </CardContent>
      </Card>
    </ResultShell>
  );
}

function NoCodePrompt() {
  return (
    <ResultShell heading="Tra cứu chứng nhận">
      <p className="text-muted-foreground">
        Vui lòng nhập mã số sinh viên để tiếp tục.
      </p>
      <LookupForm />
    </ResultShell>
  );
}

function ResultShell({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

async function fetchLookup(studentCode: string): Promise<LookupApiResponse> {
  // Resolve our own origin so the same code works in dev, preview, and prod.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `${proto}://${host}` : "");

  const pattern = DEFAULT_STUDENT_CODE_PATTERN; // referenced for type narrowing
  void pattern;

  try {
    const res = await fetch(`${origin}/api/lookup`, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentCode }),
    });
    if (!res.ok) {
      return {
        ok: false,
        code: "internal_error",
        message: "Lỗi máy chủ. Vui lòng thử lại.",
      };
    }
    return (await res.json()) as LookupApiResponse;
  } catch {
    return {
      ok: false,
      code: "internal_error",
      message: "Không kết nối được tới máy chủ.",
    };
  }
}
