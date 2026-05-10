import {
  ShieldCheckIcon,
  QrCodeIcon,
  DownloadIcon,
  AwardIcon,
  ArrowRightIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LookupForm } from "@/components/public/lookup-form";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Soft brand-tinted gradient backdrop, masked at top edge */}
      <div
        aria-hidden
        className="from-pdp-orange/10 absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b via-orange-50/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-5xl px-4 pt-12 pb-16 sm:pt-16">
        <section className="mx-auto max-w-2xl text-center">
          <div className="border-pdp-orange/30 bg-pdp-orange/10 text-pdp-orange inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <AwardIcon className="size-3.5" aria-hidden />
            PDP · FPT Polytechnic Hồ Chí Minh
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Tra cứu chứng nhận <span className="text-pdp-orange">PDP</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
            Nhập mã số sinh viên để xem và tải chứng nhận điện tử do Phòng Phát
            triển Sinh viên cấp.
          </p>
        </section>

        <Card className="border-border/60 mx-auto mt-8 max-w-2xl shadow-sm ring-1 ring-black/5">
          <CardContent className="p-5 sm:p-6">
            <LookupForm />
            <p className="text-muted-foreground mt-3 text-xs">
              Định dạng MSSV: <code>PSxxxxx</code> (ví dụ <code>PS43995</code>).
              Hệ thống tự chuyển chữ thường thành chữ hoa.
            </p>
          </CardContent>
        </Card>

        <section
          id="how"
          className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          <FeatureItem
            icon={<ShieldCheckIcon className="size-5" />}
            title="Xác thực chính thức"
            description="Chứng nhận do PDP — FPT Polytechnic HCM cấp và quản lý tập trung."
          />
          <FeatureItem
            icon={<QrCodeIcon className="size-5" />}
            title="Quét mã QR để xác minh"
            description="Mỗi chứng nhận có mã QR liên kết tới trang xác minh duy nhất."
          />
          <FeatureItem
            icon={<DownloadIcon className="size-5" />}
            title="Tải về dạng PNG"
            description="Sinh viên có thể tải file chứng nhận chất lượng cao về máy."
          />
        </section>

        <section
          id="how-detail"
          className="bg-muted/30 mx-auto mt-16 max-w-4xl rounded-xl border p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold">Hướng dẫn sử dụng</h2>
          <ol className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <Step n={1} title="Nhập MSSV">
              Gõ mã số sinh viên (định dạng <code>PSxxxxx</code>) vào ô tra cứu
              phía trên.
            </Step>
            <Step n={2} title="Xem chứng nhận">
              Nếu mã hợp lệ, hệ thống hiển thị chứng nhận đã phát hành kèm các
              thông tin chi tiết.
            </Step>
            <Step n={3} title="Tải về hoặc xác minh">
              Nhấn nút tải để lưu file PNG, hoặc dùng mã QR để mở trang xác minh
              độc lập.
            </Step>
          </ol>
          <p className="text-muted-foreground mt-5 text-xs">
            Chỉ chứng nhận đã phát hành mới hiển thị. Nếu sai sót thông tin, vui
            lòng liên hệ Phòng Phát triển Sinh viên.
          </p>
        </section>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-border/60 hover:border-pdp-orange/40 hover:shadow-pdp-orange/5 group relative rounded-xl border bg-white/70 p-5 transition-colors hover:shadow-md">
      <div className="bg-pdp-orange/10 text-pdp-orange inline-flex size-10 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      <ArrowRightIcon
        className="text-muted-foreground/40 group-hover:text-pdp-orange absolute top-5 right-5 size-4 transition-colors"
        aria-hidden
      />
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-1.5">
      <span className="bg-pdp-orange text-pdp-orange-foreground inline-flex size-7 items-center justify-center rounded-full text-xs font-bold">
        {n}
      </span>
      <span className="font-medium">{title}</span>
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}
