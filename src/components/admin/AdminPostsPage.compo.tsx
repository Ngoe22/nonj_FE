'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Eye, Pencil, Trash2 } from 'lucide-react';

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
  adminInputClass,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminContentModal from '@/components/admin/_share/AdminContentModal.compo';
import { Button } from '@/components/ui/button';
import { useAdminSoftDelete, useAdminUpdatePost } from '@/hooks/admin/admin.hook';
import type { AdminPostRow } from '@/types/admin/admin.type';

function EditPostModal({
  row,
  onClose,
}: {
  row: AdminPostRow;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const update = useAdminUpdatePost();

  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description ?? '');

  const save = async () => {
    try {
      await update.mutateAsync({
        post_id: row.id,
        body: { title, description },
      });
      toast.success(txt('updated_ok'));
      onClose();
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">{txt('edit')}</h3>
        <div className="mt-4 space-y-3">
          <AdminField label={txt('title_col')}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={adminInputClass} />
          </AdminField>
          <AdminField label="description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${adminInputClass} min-h-24 resize-y`}
            />
          </AdminField>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {txt('cancel')}
          </Button>
          <Button type="button" size="sm" disabled={update.isPending} onClick={save}>
            {update.isPending ? txt('saving') : txt('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPostsPage() {
  const txt = useTranslations('Admin');
  const searchParams = useSearchParams();
  const remove = useAdminSoftDelete('post');

  const [content, setContent] = useState<AdminPostRow | null>(null);
  const [editing, setEditing] = useState<AdminPostRow | null>(null);
  const [deleting, setDeleting] = useState<AdminPostRow | null>(null);

  // điền sẵn khi được dẫn từ trang Nhóm sang
  const initialFilters: Record<string, string> = {};
  const urlCollection = searchParams.get('collection_id');
  const urlGroup = searchParams.get('group_id');
  if (urlCollection) initialFilters.collection_id = urlCollection;
  if (urlGroup) initialFilters.group_id = urlGroup;

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
      <AdminPageHeader title={txt('nav_posts')} description={txt('posts_hint')} />

      <AdminListShell<AdminPostRow>
        // đổi URL thì mount lại để nạp lại bộ lọc điền sẵn
        key={`${urlGroup ?? ''}|${urlCollection ?? ''}`}
        resource="post"
        initialFilters={initialFilters}
        onRowClick={setContent}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'title', label: txt('title_col') },
          { key: 'author', label: txt('author') },
          { key: 'group', label: txt('group') },
          { key: 'collection', label: txt('collection') },
          { key: 'deadline', label: txt('deadline') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) => (
          <>
            <IconAction label={txt('view_content')} onClick={() => setContent(row)}>
              <Eye size={14} />
            </IconAction>
            <IconAction label={txt('edit')} onClick={() => setEditing(row)}>
              <Pencil size={14} />
            </IconAction>
            <IconAction label={txt('soft_delete')} tone="danger" onClick={() => setDeleting(row)}>
              <Trash2 size={14} />
            </IconAction>
          </>
        )}
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label={txt('id')}>
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label={txt('title_col')}>
              <AdminTextFilter value={query.title ?? ''} onChange={(v) => setFilter('title', v)} />
            </AdminField>
            <AdminField label={txt('author')}>
              <AdminTextFilter value={query.user_name ?? ''} onChange={(v) => setFilter('user_name', v)} />
            </AdminField>
            <AdminField label="group_id">
              <AdminTextFilter value={query.group_id ?? ''} onChange={(v) => setFilter('group_id', v)} />
            </AdminField>
            <AdminField label="collection_id">
              <AdminTextFilter value={query.collection_id ?? ''} onChange={(v) => setFilter('collection_id', v)} />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <td className="max-w-[230px] px-3 py-2 align-top">
              <span className="flex min-w-0 flex-col">
                <span
                  className="cursor-copy truncate"
                  title={row.title}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  {row.title}
                </span>
                <AdminDeletedBadge isDeleted={row.is_deleted} />
              </span>
            </td>
            <AdminTextCell value={row.user?.user_name} width="max-w-[130px]" />
            {/* chỉ hiện slug của nhóm, không còn là link nhảy sang trang người dùng */}
            <AdminTextCell value={row.group?.slug} width="max-w-[150px]" />
            <AdminTextCell value={row.post_collection?.title} width="max-w-[180px]" />
            <AdminDateCell value={row.deadline_at} />
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

      {editing && <EditPostModal row={editing} onClose={() => setEditing(null)} />}

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
