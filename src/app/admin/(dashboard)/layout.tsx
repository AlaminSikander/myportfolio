import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell email={user.email}>{children}</AdminShell>;
}
