import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata = { title: "Đăng nhập quản trị" };

type SearchParams = Promise<{ redirect?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { redirect } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1.5">
          <p className="text-pdp-orange text-xs font-semibold tracking-wide uppercase">
            Quản trị · PDP
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Đăng nhập quản trị viên
          </h1>
          <p className="text-muted-foreground text-sm">
            Khu vực dành riêng cho cán bộ Phòng Phát triển Sinh viên — FPT
            Polytechnic Hồ Chí Minh.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={redirect} />
          <p className="text-muted-foreground mt-6 text-center text-xs">
            Bạn là sinh viên?{" "}
            <Link href="/" className="hover:text-foreground underline">
              Tra cứu chứng nhận tại đây
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
