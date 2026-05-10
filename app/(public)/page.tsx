import { ShieldCheckIcon, QrCodeIcon, DownloadIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LookupForm } from "@/components/public/lookup-form";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-pdp-orange text-sm font-semibold tracking-wide uppercase">
          PDP · FPT Polytechnic Hồ Chí Minh
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Tra cứu chứng nhận PDP
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
          Nhập mã số sinh viên để xem và tải chứng nhận điện tử do Phòng Phát
          triển Sinh viên cấp.
        </p>
      </section>

      <Card className="border-border/60 mx-auto mt-8 max-w-2xl shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <LookupForm />
        </CardContent>
      </Card>

      <section
        id="how"
        className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3"
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
    <div className="border-border/60 rounded-lg border bg-white/60 p-4">
      <div className="bg-pdp-orange/10 text-pdp-orange inline-flex size-9 items-center justify-center rounded-md">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}
