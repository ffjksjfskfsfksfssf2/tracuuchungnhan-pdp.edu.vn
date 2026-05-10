import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Tổng quan" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Khu vực dành cho cán bộ Phòng Phát triển Sinh viên — quản lý chiến
          dịch, nhập danh sách và sinh chứng nhận hàng loạt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Placeholder
          title="Chiến dịch"
          description="Tạo và quản lý các đợt cấp chứng nhận."
          milestone="M5"
        />
        <Placeholder
          title="Nhập danh sách Excel"
          description="Tải lên file Excel của khoá học, hệ thống sẽ tự kiểm tra dữ liệu."
          milestone="M6"
        />
        <Placeholder
          title="Sinh chứng nhận hàng loạt"
          description="Sinh PNG ngay trong trình duyệt từ template và Excel."
          milestone="M7"
        />
        <Placeholder
          title="Đồng bộ Google Drive"
          description="Khớp file PNG với link Drive và lưu metadata vào Supabase."
          milestone="M9"
        />
      </div>
    </div>
  );
}

function Placeholder({
  title,
  description,
  milestone,
}: {
  title: string;
  description: string;
  milestone: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <span className="text-muted-foreground bg-muted rounded-md px-1.5 py-0.5 text-xs font-medium">
            {milestone}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
