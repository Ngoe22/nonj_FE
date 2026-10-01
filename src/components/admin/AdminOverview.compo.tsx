'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ClipboardList,
  FileText,
  Flag,
  FolderTree,
  Users,
  UsersRound,
} from 'lucide-react';

import { useAdminList, useAdminOnlineCount } from '@/hooks/admin/admin.hook';

const STATS = [
  { resource: 'user', labelKey: 'nav_users', href: '/admin/users', icon: <Users size={16} /> },
  {
    resource: 'relationship',
    labelKey: 'nav_relationships',
    href: '/admin/relationships',
    icon: <UsersRound size={16} />,
  },
  { resource: 'group', labelKey: 'nav_groups', href: '/admin/groups', icon: <FolderTree size={16} /> },
  { resource: 'post', labelKey: 'nav_posts', href: '/admin/posts', icon: <ClipboardList size={16} /> },
  {
    resource: 'preparation',
    labelKey: 'nav_preparations',
    href: '/admin/preparations',
    icon: <FileText size={16} />,
  },
  { resource: 'report', labelKey: 'nav_reports', href: '/admin/reports', icon: <Flag size={16} /> },
] as const;

/** Thẻ số liệu: tự gọi API lấy `total` của từng mục */
function StatCard({
  resource,
  labelKey,
  href,
  icon,
}: {
  resource: (typeof STATS)[number]['resource'];
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}) {
  const txt = useTranslations('Admin');
  const { data, isLoading } = useAdminList(resource, { page: 1, limit: 1 });

  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-surface p-3 transition hover:border-border-strong"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{txt(labelKey)}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {isLoading ? '—' : (data?.total ?? 0)}
      </p>
    </Link>
  );
}

export default function AdminOverview() {
  const txt = useTranslations('Admin');
  const online = useAdminOnlineCount();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{txt('nav_dashboard')}</h1>
      </div>

      {/* Số người đang online — lấy qua WebSocket, không polling */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{txt('online_now')}</p>
          <p className="text-2xl font-medium tabular-nums">{online ?? '—'}</p>
        </div>
        <p className="ml-auto max-w-xs text-right text-xs text-muted-foreground">
          {txt('online_hint')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((item) => (
          <StatCard key={item.resource} {...item} />
        ))}
      </div>
    </div>
  );
}
