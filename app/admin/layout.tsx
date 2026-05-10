import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Belt-and-braces: proxy.ts already redirects unauthenticated users; this
  // also blocks authenticated-but-non-admin users.
  await requireAdmin();
  return <>{children}</>;
}
