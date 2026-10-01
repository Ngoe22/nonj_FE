'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Trash2, X } from 'lucide-react';

import {
  AdminConfirm,
  AdminDateCell,
  AdminDeletedBadge,
  AdminField,
  AdminIdCell,
  AdminListShell,
  AdminPageHeader,
  AdminSelectFilter,
  AdminTextCell,
  AdminTextFilter,
  IconAction,
} from '@/components/admin/_share/AdminListShell.compo';
import { Badge } from '@/components/ui/badge';
import {
  useAdminSoftDelete,
  useAdminUserFriends,
  useAdminUserIngoing,
  useAdminUserOutgoing,
} from '@/hooks/admin/admin.hook';
import { Friend_Request_Status } from '@/enum/friend_request/friend_request.enum';
import type { AdminRelationshipRow, AdminUserBrief } from '@/types/admin/admin.type';

const TABS = ['friends', 'ingoing', 'outgoing'] as const;
type TabKey = (typeof TABS)[number];

function nameOf(user?: AdminUserBrief | null) {
  return user?.user_name ?? '—';
}

/** Một tab quan hệ của người dùng đang chọn */
function RelationshipTab({ tab, userId }: { tab: TabKey; userId: string }) {
  const txt = useTranslations('Admin');

  const friends = useAdminUserFriends(userId, tab === 'friends');
  const ingoing = useAdminUserIngoing(userId, tab === 'ingoing');
  const outgoing = useAdminUserOutgoing(userId, tab === 'outgoing');

  const active =
    tab === 'friends' ? friends : tab === 'ingoing' ? ingoing : outgoing;
  const rows = (active.data as Record<string, unknown>[] | undefined) ?? [];

  if (active.isLoading)
    return <p className="text-sm text-muted-foreground">{txt('loading')}</p>;
  if (rows.length === 0)
    return <p className="text-sm text-muted-foreground">{txt('empty')}</p>;

  return (
    <ul className="space-y-2">
      {rows.map((row, index) => {
        const other =
          tab === 'friends'
            ? (row.user_friend as AdminUserBrief | undefined)
            : tab === 'ingoing'
              ? (row.sender as AdminUserBrief | undefined)
              : (row.receiver as AdminUserBrief | undefined);

        return (
          <li
            key={String(row.id ?? index)}
            className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm"
          >
            <span className="min-w-0 flex-1 truncate" title={nameOf(other)}>
              {nameOf(other)}
            </span>
            {typeof row.status === 'string' && (
              <Badge variant="secondary">{row.status}</Badge>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Chi tiết một người trong bảng quan hệ: 3 tab bạn bè / đến / đi */
function RelationshipDetail({
  row,
  onClose,
}: {
  row: AdminRelationshipRow;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const [userId, setUserId] = useState(row.sender?.id ?? row.receiver?.id ?? '');
  const [tab, setTab] = useState<TabKey>('friends');

  const candidates = [row.sender, row.receiver].filter(
    (user): user is AdminUserBrief => !!user?.id,
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-border p-4">
          <h3 className="min-w-0 flex-1 font-medium">{txt('relationship_detail')}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={txt('close')}
            className="rounded p-1 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            <X size={16} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          {/* chọn xem quan hệ của NGƯỜI GỬI hay NGƯỜI NHẬN */}
          <div className="flex flex-wrap gap-2">
            {candidates.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setUserId(user.id)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  userId === user.id
                    ? 'border-foreground/40 font-medium'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {user.user_name}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-1 border-b border-border">
            {TABS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-3 py-2 text-sm transition ${
                  tab === key
                    ? 'border-b-2 border-foreground/60 font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {txt(key)}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {userId && <RelationshipTab tab={tab} userId={userId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminRelationshipsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminSoftDelete('relationship');

  const [detail, setDetail] = useState<AdminRelationshipRow | null>(null);
  const [deleting, setDeleting] = useState<AdminRelationshipRow | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success(txt('deleted_ok'));
      setDeleting(null);
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminPageHeader
        title={txt('nav_relationships')}
        description={txt('relationships_hint')}
      />

      <AdminListShell<AdminRelationshipRow>
        resource="relationship"
        onRowClick={setDetail}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'sender', label: txt('sender') },
          { key: 'receiver', label: txt('receiver') },
          { key: 'status', label: txt('status') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) => (
          <IconAction
            label={txt('soft_delete')}
            tone="danger"
            onClick={() => setDeleting(row)}
          >
            <Trash2 size={14} />
          </IconAction>
        )}
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label={txt('id')}>
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label={txt('any_side_user')}>
              <AdminTextFilter value={query.user_name ?? ''} onChange={(v) => setFilter('user_name', v)} />
            </AdminField>
            <AdminField label={txt('sender')}>
              <AdminTextFilter value={query.sender_user_name ?? ''} onChange={(v) => setFilter('sender_user_name', v)} />
            </AdminField>
            <AdminField label={txt('receiver')}>
              <AdminTextFilter value={query.receiver_user_name ?? ''} onChange={(v) => setFilter('receiver_user_name', v)} />
            </AdminField>
            <AdminField label={txt('status')}>
              <AdminSelectFilter
                value={query.status ?? ''}
                onChange={(v) => setFilter('status', v)}
                options={[
                  { value: '', label: txt('all') },
                  ...Object.values(Friend_Request_Status).map((value) => ({ value, label: value })),
                ]}
              />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminTextCell value={nameOf(row.sender)} width="max-w-[160px]" />
            <AdminTextCell value={nameOf(row.receiver)} width="max-w-[160px]" />
            <td className="w-[170px] px-3 py-2 align-top">
              <Badge variant="secondary">{row.status}</Badge>
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {detail && <RelationshipDetail row={detail} onClose={() => setDetail(null)} />}

      <AdminConfirm
        open={!!deleting}
        title={txt('confirm_delete_title')}
        message={txt('confirm_delete_message')}
        pending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
