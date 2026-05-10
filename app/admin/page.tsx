import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Bảng điều khiển PDP" };

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Bảng điều khiển PDP</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Đây là khu vực dành cho quản trị viên. Các chức năng quản lý chiến dịch,
        nhập danh sách, sinh chứng nhận hàng loạt sẽ được triển khai ở Milestone
        4–10.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Placeholder
          title="Chiến dịch"
          description="Tạo và quản lý các đợt cấp chứng nhận."
        />
        <Placeholder
          title="Sinh chứng nhận"
          description="Tải template + Excel để sinh hàng loạt PNG."
        />
      </div>
    </div>
  );
}

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold">{title}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
