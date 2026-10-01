import AdminShell from '@/components/admin/AdminShell.compo';

/**
 * Layout RIÊNG của khu quản trị — cố ý KHÔNG nằm trong `(home)` nên không dùng
 * header/sidebar của giao diện người dùng.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
