'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Check, Trash2, X } from 'lucide-react';

import {
  AdminConfirm,
  AdminDateCell,
  AdminField,
  AdminIdCell,
  AdminListShell,
  AdminPageHeader,
  AdminSelectFilter,
  AdminTextFilter,
  IconAction,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminDetailModal from '@/components/admin/_share/AdminDetailModal.compo';
import { Badge } from '@/components/ui/badge';
import {
  useAdminDeleteJoinRequest,
  useAdminUpdateJoinRequest,
} from '@/hooks/admin/admin.hook';
import {
  Group_Join_Request_Status,
  Group_Join_Request_Status_UPDATE,
} from '@/enum/group/group_mode.enum';
import type { AdminJoinRequestRow } from '@/types/admin/admin.type';

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-status-warning-bg text-status-warning',
  APPROVED: 'bg-status-success-bg text-status-success',
  REJECTED: 'bg-status-neutral-bg text-status-neutral',
};

export default function AdminJoinRequestsPage() {
  const txt = useTranslations('Admin');
  const update = useAdminUpdateJoinRequest();
  const remove = useAdminDeleteJoinRequest();

  const [detail, setDetail] = useState<AdminJoinRequestRow | null>(null);
  const [deleting, setDeleting] = useState<AdminJoinRequestRow | null>(null);

  const decide = async (row: AdminJoinRequestRow, status: 'APPROVED' | 'REJECTED') => {
    try {
      await update.mutateAsync({ join_request_id: row.id, status });
      toast.success(txt('updated_ok'));
    } catch {
      toast.error(txt('action_fail'));
    }
  };

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
        title={txt('nav_join_requests')}
        description={txt('join_requests_hint')}
      />

      <AdminListShell<AdminJoinRequestRow>
        resource="join_request"
        onRowClick={setDetail}
        columns={[
          { key: 'id', label: 'Request ID' },
          { key: 'user', label: 'User ID' },
          { key: 'group', label: 'Group ID' },
          { key: 'status', label: txt('status') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) =>
          row.status === Group_Join_Request_Status.PENDING ? (
            <>
              <IconAction
                label={txt('approve')}
                disabled={update.isPending}
                onClick={() => decide(row, Group_Join_Request_Status_UPDATE.APPROVED)}
              >
                <Check size={14} />
              </IconAction>
              <IconAction
                label={txt('reject')}
                tone="danger"
                disabled={update.isPending}
                onClick={() => decide(row, Group_Join_Request_Status_UPDATE.REJECTED)}
              >
                <X size={14} />
              </IconAction>
              <IconAction label={txt('soft_delete')} tone="danger" onClick={() => setDeleting(row)}>
                <Trash2 size={14} />
              </IconAction>
            </>
          ) : (
            // Đơn đã APPROVED/REJECTED: BE `adminHardDelete` chỉ xoá được đơn
            // PENDING -> hiện nút xoá ở đây là bấm vào luôn lỗi 404.
            null
          )
        }
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label="Request ID">
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label="User ID">
              <AdminTextFilter value={query.user_id ?? ''} onChange={(v) => setFilter('user_id', v)} />
            </AdminField>
            <AdminField label="Group ID">
              <AdminTextFilter value={query.group_id ?? ''} onChange={(v) => setFilter('group_id', v)} />
            </AdminField>
            <AdminField label={txt('status')}>
              <AdminSelectFilter
                value={query.status ?? ''}
                onChange={(v) => setFilter('status', v)}
                options={[
                  { value: '', label: txt('all') },
                  ...Object.values(Group_Join_Request_Status).map((value) => ({ value, label: value })),
                ]}
              />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminIdCell id={row.sender?.id ?? ''} />
            <AdminIdCell id={row.group?.id ?? ''} />
            <td className="w-[150px] px-3 py-2 align-top">
              <Badge className={STATUS_TONE[row.status] ?? ''}>{row.status}</Badge>
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {detail && (
        <AdminDetailModal
          title={`${txt('nav_join_requests')} · ${detail.id.slice(0, 8)}`}
          onClose={() => setDetail(null)}
          fields={[
            { label: 'Request ID', value: detail.id },
            { label: 'User ID', value: detail.sender?.id },
            { label: txt('username'), value: detail.sender?.user_name },
            { label: 'Group ID', value: detail.group?.id },
            { label: 'Group slug', value: detail.group?.slug },
            { label: 'Group name', value: detail.group?.name },
            { label: txt('status'), value: detail.status },
            { label: txt('created_at'), value: detail.created_at },
            { label: 'reviewed_at', value: detail.reviewed_at },
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
