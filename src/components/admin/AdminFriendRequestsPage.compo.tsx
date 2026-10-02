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
  AdminSelectFilter,
  AdminTextCell,
  AdminTextFilter,
  IconAction,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminDetailModal from '@/components/admin/_share/AdminDetailModal.compo';
import { Badge } from '@/components/ui/badge';
import { useAdminSoftDelete } from '@/hooks/admin/admin.hook';
import { Friend_Request_Status } from '@/enum/friend_request/friend_request.enum';
import type { AdminRelationshipRow } from '@/types/admin/admin.type';

export default function AdminFriendRequestsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminSoftDelete('friend_request');

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
        title={txt('nav_friend_requests')}
        description={txt('friend_requests_hint')}
      />

      <AdminListShell<AdminRelationshipRow>
        resource="friend_request"
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
            <AdminTextCell value={row.sender?.user_name} width="max-w-[160px]" />
            <AdminTextCell value={row.receiver?.user_name} width="max-w-[160px]" />
            <td className="w-[170px] px-3 py-2 align-top">
              <Badge variant="secondary">{row.status}</Badge>
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {detail && (
        <AdminDetailModal
          title={`${txt('nav_friend_requests')} · ${row8(detail.id)}`}
          onClose={() => setDetail(null)}
          fields={[
            { label: 'ID', value: detail.id },
            { label: txt('sender'), value: detail.sender?.user_name },
            { label: `${txt('sender')} ID`, value: detail.sender?.id },
            { label: txt('receiver'), value: detail.receiver?.user_name },
            { label: `${txt('receiver')} ID`, value: detail.receiver?.id },
            { label: txt('status'), value: detail.status },
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

function row8(id: string) {
  return id.slice(0, 8);
}
