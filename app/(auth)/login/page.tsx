import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Đăng nhập quản trị" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <Card className="border-border/60">
        <CardHeader className="space-y-1.5">
          <p className="text-pdp-orange text-xs font-semibold tracking-wide uppercase">
            Quản trị · PDP
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Đăng nhập quản trị viên
          </h1>
          <p className="text-muted-foreground text-sm">
            Trang đăng nhập sẽ được kích hoạt ở Milestone 4. Hiện tại sinh viên
            có thể truy cập trang tra cứu công khai.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Trở về trang chủ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
