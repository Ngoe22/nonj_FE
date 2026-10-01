'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Eye, Trash2 } from 'lucide-react';

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
import AdminContentModal from '@/components/admin/_share/AdminContentModal.compo';
import { useAdminSoftDelete } from '@/hooks/admin/admin.hook';
import type { AdminPreparationRow } from '@/types/admin/admin.type';

export default function AdminPreparationsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminSoftDelete('preparation');

  const [content, setContent] = useState<AdminPreparationRow | null>(null);
  const [deleting, setDeleting] = useState<AdminPreparationRow | null>(null);

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
        title={txt('nav_preparations')}
        description={txt('preparations_hint')}
      />

      <AdminListShell<AdminPreparationRow>
        resource="preparation"
        onRowClick={setContent}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'title', label: txt('title_col') },
          { key: 'owner', label: txt('owner') },
          { key: 'collection', label: txt('collection') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) => (
          <IconAction label={txt('soft_delete')} tone="danger" onClick={() => setDeleting(row)}>
            <Trash2 size={14} />
          </IconAction>
        )}
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label={txt('id')}>
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label={txt('title_col')}>
              <AdminTextFilter value={query.title ?? ''} onChange={(v) => setFilter('title', v)} />
            </AdminField>
            <AdminField label={txt('owner')}>
              <AdminTextFilter value={query.user_name ?? ''} onChange={(v) => setFilter('user_name', v)} />
            </AdminField>
            <AdminField label="collection_id">
              <AdminTextFilter value={query.collection_id ?? ''} onChange={(v) => setFilter('collection_id', v)} />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <td className="max-w-[280px] px-3 py-2 align-top">
              <span className="flex min-w-0 flex-col">
                <span className="flex min-w-0 items-center gap-1">
                  <Eye size={12} className="shrink-0 text-muted-foreground/50" />
                  <span className="min-w-0 cursor-copy truncate" title={row.title}>
                    {row.title}
                  </span>
                </span>
                <AdminDeletedBadge isDeleted={row.is_deleted} />
              </span>
            </td>
            <AdminTextCell value={row.user?.user_name} width="max-w-[140px]" />
            <AdminTextCell value={row.collection?.title} width="max-w-[200px]" />
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {content && (
        <AdminContentModal
          title={content.title}
          content={content.content}
          onClose={() => setContent(null)}
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
