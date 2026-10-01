'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

import {
  AdminConfirm,
  AdminDateCell,
  AdminDeletedBadge,
  AdminField,
  AdminIdCell,
  AdminListShell,
  AdminPageHeader,
  AdminTextCell,
  AdminTextFilter,
  IconAction,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminDetailModal from '@/components/admin/_share/AdminDetailModal.compo';
import { useAdminDeleteFriendship } from '@/hooks/admin/admin.hook';
import type { AdminFriendshipRow } from '@/types/admin/admin.type';

export default function AdminFriendsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminDeleteFriendship();

  const [detail, setDetail] = useState<AdminFriendshipRow | null>(null);
  const [deleting, setDeleting] = useState<AdminFriendshipRow | null>(null);

  const confirmDelete = async () => {
    if (!deleting?.user?.id || !deleting?.user_friend?.id) return;
    try {
      await remove.mutateAsync({
        user_id: deleting.user.id,
        friend_id: deleting.user_friend.id,
      });
      toast.success(txt('deleted_ok'));
      setDeleting(null);
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminPageHeader title={txt('nav_friends')} description={txt('friends_hint')} />

      <AdminListShell<AdminFriendshipRow>
        resource="friendship"
        onRowClick={setDetail}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'user', label: txt('user') },
          { key: 'user_friend', label: txt('friend') },
          { key: 'be_friend_at', label: txt('be_friend_at') },
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
            <AdminField label={txt('user')}>
              <AdminTextFilter value={query.a_user_name ?? ''} onChange={(v) => setFilter('a_user_name', v)} />
            </AdminField>
            <AdminField label={txt('friend')}>
              <AdminTextFilter value={query.b_user_name ?? ''} onChange={(v) => setFilter('b_user_name', v)} />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminTextCell value={row.user?.user_name} width="max-w-[160px]" />
            <AdminTextCell value={row.user_friend?.user_name} width="max-w-[160px]" />
            <AdminDateCell value={row.be_friend_at} />
            <td className="px-3 py-2 align-top">
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
          </>
        )}
      />

      {detail && (
        <AdminDetailModal
          title={`${txt('nav_friends')} · ${detail.id.slice(0, 8)}`}
          onClose={() => setDetail(null)}
          fields={[
            { label: 'ID', value: detail.id },
            { label: txt('user'), value: detail.user?.user_name },
            { label: `${txt('user')} ID`, value: detail.user?.id },
            { label: txt('friend'), value: detail.user_friend?.user_name },
            { label: `${txt('friend')} ID`, value: detail.user_friend?.id },
            { label: txt('be_friend_at'), value: detail.be_friend_at },
            { label: txt('created_at'), value: detail.created_at },
            { label: txt('updated_at'), value: detail.updated_at },
            { label: txt('deleted_at'), value: detail.deleted_at },
          ]}
        />
      )}

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
