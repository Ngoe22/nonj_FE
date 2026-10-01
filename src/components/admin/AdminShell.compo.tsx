'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Flag,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Server,
  ShieldCheck,
  Users,
  UsersRound,
  X,
} from 'lucide-react';

import { useGetMyProfile } from '@/hooks/profile/useGetMyProfile.hook';
import { useLogout } from '@/hooks/auth/useLogout.hook';
import { useAdminOnlineCount } from '@/hooks/admin/admin.hook';
import { User_Role } from '@/enum/user/user.enum';

interface NavItem {
  href: string;
  labelKey: string;
  icon: ReactNode;
}

const NAV: NavItem[] = [
  { href: '/admin', labelKey: 'nav_dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/users', labelKey: 'nav_users', icon: <Users size={16} /> },
  {
    href: '/admin/friend_requests',
    labelKey: 'nav_friend_requests',
    icon: <UsersRound size={16} />,
  },
  { href: '/admin/friends', labelKey: 'nav_friends', icon: <Users size={16} /> },
  { href: '/admin/groups', labelKey: 'nav_groups', icon: <FolderTree size={16} /> },
  { href: '/admin/posts', labelKey: 'nav_posts', icon: <ClipboardList size={16} /> },
  {
    href: '/admin/preparations',
    labelKey: 'nav_preparations',
    icon: <FileText size={16} />,
  },
  { href: '/admin/reports', labelKey: 'nav_reports', icon: <Flag size={16} /> },
];

/**
 * Khung riêng của khu quản trị.
 *
 * CỐ Ý không dùng `HomeLayout`: trang admin phải tách hẳn khỏi giao diện người
 * dùng (sidebar và header riêng), chỉ dùng chung provider i18n + TanStack ở các
 * layout cấp trên.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const txt = useTranslations('Admin');
  const router = useRouter();
  const pathname = usePathname();

  const { data: me, isLoading } = useGetMyProfile();
  const online = useAdminOnlineCount();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = me?.role === User_Role.SYSTEM_ADMIN;

  // Chưa đăng nhập / không phải admin -> đá về trang login riêng của admin
  useEffect(() => {
    if (isLoading) return;
    if (!isAdmin) router.replace('/admin/login');
  }, [isLoading, isAdmin, router]);

  /**
   * Dùng `useLogout` có sẵn: nó gọi đúng `POST /auth/logout/all` (thu hồi cả
   * refresh token ở server) VÀ `queryClient.clear()` — nếu không xoá cache thì
   * tài khoản đăng nhập sau vẫn thấy dữ liệu cũ.
   */
  const logoutMutation = useLogout();

  if (isLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        {txt('checking_permission')}
      </div>
    );
  }

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
              active
                ? 'bg-surface-hover font-medium text-foreground'
                : 'text-muted-foreground hover:bg-surface-hover/60 hover:text-foreground'
            }`}
          >
            {item.icon}
            {txt(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    // `h-screen` + `overflow-hidden`: thân trang KHÔNG cuộn, chỉ vùng dữ
    // liệu bên trong cuộn (khác phần người dùng).
    <div className="flex h-screen overflow-hidden bg-background">
      {/* -------------------- Sidebar (desktop) -------------------- */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface p-4 lg:flex lg:flex-col">
        <div className="mb-6 flex items-center gap-2 px-2">
          <ShieldCheck size={18} className="text-muted-foreground" />
          <span className="font-semibold">{txt('title')}</span>
        </div>

        {nav}

        <div className="mt-auto space-y-2 pt-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <Server size={14} className="text-status-success" />
            <span className="text-muted-foreground">{txt('online')}</span>
            <span className="ml-auto font-semibold tabular-nums">
              {online ?? '—'}
            </span>
          </div>

          <Link
            href="/group"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            <ArrowLeft size={15} />
            {txt('back_to_app')}
          </Link>

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={15} />
            {txt('logout')}
          </button>
        </div>
      </aside>

      {/* -------------------- Sidebar (mobile) -------------------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute top-0 left-0 h-full w-72 border-r border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">{txt('title')}</span>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* -------------------- Nội dung -------------------- */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-hover lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {txt('signed_in_as', { name: me?.user_name ?? '' })}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs">
            <Server size={13} className="text-status-success" />
            <span className="text-muted-foreground">{txt('online')}</span>
            <span className="font-semibold tabular-nums">{online ?? '—'}</span>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
