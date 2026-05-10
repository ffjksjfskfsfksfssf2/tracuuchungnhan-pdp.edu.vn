import { headers } from "next/headers";
import Link from "next/link";
import {
  CheckCircle2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  SearchXIcon,
} from "lucide-react";

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
      <ResultShell heading="Mã số sinh viên không hợp lệ" tone="error">
        <p className="text-muted-foreground">
          Định dạng đúng là <code>PSxxxxx</code> (ví dụ <code>PS43995</code>).
          Vui lòng nhập lại.
        </p>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <LookupForm />
          </CardContent>
        </Card>
      </ResultShell>
    );
  }

  const studentCode = parsed.data;
  const result = await fetchLookup(studentCode);

  if (!result.ok) {
    return (
      <ResultShell heading="Không tìm thấy chứng nhận" tone="empty">
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-6">
            <div className="bg-muted text-muted-foreground inline-flex size-12 items-center justify-center rounded-full">
              <SearchXIcon className="size-5" aria-hidden />
            </div>
            <p>
              Hệ thống không tìm thấy chứng nhận đã công bố cho mã số{" "}
              <strong>{studentCode}</strong>. Vui lòng kiểm tra lại hoặc liên hệ
              phòng PDP.
            </p>
            <LookupForm />
          </CardContent>
        </Card>
      </ResultShell>
    );
  }

  const cert = result.certificate;
  const issueDate = new Date(cert.issue_date).toLocaleDateString("vi-VN");

  return (
    <ResultShell heading="Đã tìm thấy chứng nhận" tone="success">
      <Card className="border-pdp-orange/30 ring-pdp-orange/5 overflow-hidden ring-1">
        {/* Status banner */}
        <div className="border-pdp-orange/20 bg-pdp-orange/5 flex items-center gap-2 border-b px-6 py-3">
          <CheckCircle2Icon className="text-pdp-orange size-5" aria-hidden />
          <span className="text-pdp-orange text-sm font-semibold">
            Chứng nhận hợp lệ và đã được phát hành
          </span>
        </div>
        <CardContent className="space-y-5 p-6">
          <div>
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              Họ và tên
            </p>
            <p className="mt-0.5 text-2xl leading-tight font-semibold">
              {cert.full_name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Field label="MSSV" value={cert.student_code} />
            <Field label="Ngày cấp" value={issueDate} />
            <Field
              label="Chương trình"
              value={cert.certificate_title ?? cert.campaign_title}
              span={2}
            />
            {cert.signer_name ? (
              <Field
                label="Đơn vị cấp"
                value={
                  <>
                    {cert.signer_name}
                    {cert.signer_title ? ` · ${cert.signer_title}` : ""}
                  </>
                }
                span={2}
              />
            ) : null}
          </div>

          {(cert.drive_view_url || cert.drive_download_url) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {cert.drive_view_url ? (
                <Button asChild variant="outline">
                  <a
                    href={cert.drive_view_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon aria-hidden />
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
                    <DownloadIcon aria-hidden />
                    Tải về (PNG)
                  </a>
                </Button>
              ) : null}
            </div>
          )}

          <p className="text-muted-foreground border-border/60 border-t pt-3 text-xs">
            Mã xác thực:{" "}
            <Link
              href={`/verify/${cert.verification_code}`}
              className="hover:text-pdp-orange font-mono hover:underline"
            >
              {cert.verification_code}
            </Link>{" "}
            · Có thể chia sẻ link này hoặc dùng mã QR trên chứng nhận để xác
            minh.
          </p>
        </CardContent>
      </Card>
    </ResultShell>
  );
}

function NoCodePrompt() {
  return (
    <ResultShell heading="Tra cứu chứng nhận">
      <Card className="border-border/60">
        <CardContent className="space-y-3 p-6">
          <p className="text-muted-foreground">
            Vui lòng nhập mã số sinh viên để tiếp tục.
          </p>
          <LookupForm />
        </CardContent>
      </Card>
    </ResultShell>
  );
}

function Field({
  label,
  value,
  span,
}: {
  label: string;
  value: React.ReactNode;
  span?: 2;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : undefined}>
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function ResultShell({
  heading,
  tone,
  children,
}: {
  heading: string;
  tone?: "success" | "error" | "empty";
  children: React.ReactNode;
}) {
  const accentClass =
    tone === "success"
      ? "text-pdp-orange"
      : tone === "error"
        ? "text-destructive"
        : tone === "empty"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <p
        className={`text-xs tracking-wide uppercase ${accentClass} font-semibold`}
      >
        Kết quả tra cứu
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {heading}
      </h1>
      <div className="mt-6 space-y-4">{children}</div>
      <div className="mt-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">← Trở về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

async function fetchLookup(studentCode: string): Promise<LookupApiResponse> {
  // Resolve our own origin so the same code works in dev, preview, and prod.
  // We can't rely on absolute env URLs alone (they may not be set in dev).
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  try {
    const res = await fetch(`${origin}/api/lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCode }),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        code: "not_found",
        message: "Không tìm thấy chứng nhận",
      };
    }
    return (await res.json()) as LookupApiResponse;
  } catch {
    // Network error / unreachable Supabase URL etc — graceful fallback.
    return {
      ok: false,
      code: "internal_error",
      message: "Không tìm thấy chứng nhận",
    };
  }
}

// Re-export the default pattern so the page docstring can reference it.
export { DEFAULT_STUDENT_CODE_PATTERN };
