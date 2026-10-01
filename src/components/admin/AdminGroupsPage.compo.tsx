'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

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
  adminInputClass,
} from '@/components/admin/_share/AdminListShell.compo';
import AdminDetailModal from '@/components/admin/_share/AdminDetailModal.compo';
import { Button } from '@/components/ui/button';
import {
  useAdminGroupCollections,
  useAdminSoftDelete,
  useAdminUpdateGroup,
} from '@/hooks/admin/admin.hook';
import { Link } from '@/i18n/navigation';
import { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';
import type { AdminGroupRow } from '@/types/admin/admin.type';

/** Bộ sưu tập của nhóm — bấm tiếp sẽ mở trang bài tập đã lọc sẵn theo bộ sưu tập */
function GroupCollections({ groupId }: { groupId: string }) {
  const txt = useTranslations('Admin');
  const { data, isLoading } = useAdminGroupCollections(groupId);

  if (isLoading)
    return <p className="text-sm text-muted-foreground">{txt('loading')}</p>;

  const items = (data as { id: string; title: string }[] | undefined) ?? [];
  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">{txt('empty')}</p>;

  return (
    <ul className="space-y-2">
      {items.map((collection) => (
        <li key={collection.id}>
          {/* sang trang BÀI TẬP của admin với collection điền sẵn, không nhảy
              sang trang người dùng */}
          <Link
            href={`/admin/posts?collection_id=${collection.id}&group_id=${groupId}`}
            className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm transition hover:bg-surface-hover"
          >
            <span className="min-w-0 flex-1 truncate">{collection.title}</span>
            <ExternalLink size={13} className="shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EditGroupModal({
  row,
  onClose,
}: {
  row: AdminGroupRow;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const update = useAdminUpdateGroup();

  const [name, setName] = useState(row.name);
  const [description, setDescription] = useState(row.description ?? '');
  const [joinMode, setJoinMode] = useState(row.join_mode);
  const [viewMode, setViewMode] = useState(row.view_mode);

  const save = async () => {
    try {
      await update.mutateAsync({
        group_id: row.id,
        body: { name, description, join_mode: joinMode, view_mode: viewMode },
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
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">
          {txt('edit')} · {row.slug}
        </h3>

        <div className="mt-4 space-y-3">
          <AdminField label={txt('name')}>
            <input value={name} onChange={(e) => setName(e.target.value)} className={adminInputClass} />
          </AdminField>
          <AdminField label="description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${adminInputClass} min-h-20 resize-y`}
            />
          </AdminField>
          <AdminField label="join_mode">
            <select
              value={joinMode}
              onChange={(e) => setJoinMode(e.target.value as Group_Join_Mode)}
              className={adminInputClass}
            >
              {Object.values(Group_Join_Mode).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="view_mode">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as Group_View_Mode)}
              className={adminInputClass}
            >
              {Object.values(Group_View_Mode).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
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

export default function AdminGroupsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminSoftDelete('group');

  const [detail, setDetail] = useState<AdminGroupRow | null>(null);
  const [editing, setEditing] = useState<AdminGroupRow | null>(null);
  const [deleting, setDeleting] = useState<AdminGroupRow | null>(null);

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
      <AdminPageHeader title={txt('nav_groups')} description={txt('groups_hint')} />

      <AdminListShell<AdminGroupRow>
        resource="group"
        onRowClick={setDetail}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'slug', label: 'slug' },
          { key: 'name', label: txt('name') },
          { key: 'founder', label: txt('founder') },
          { key: 'join_mode', label: 'join' },
          { key: 'view_mode', label: 'view' },
          { key: 'total_member', label: txt('total_member') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) => (
          <>
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
            <AdminField label="slug">
              <AdminTextFilter value={query.slug ?? ''} onChange={(v) => setFilter('slug', v)} />
            </AdminField>
            <AdminField label={txt('name')}>
              <AdminTextFilter value={query.name ?? ''} onChange={(v) => setFilter('name', v)} />
            </AdminField>
            <AdminField label={txt('founder')}>
              <AdminTextFilter value={query.founder_user_name ?? ''} onChange={(v) => setFilter('founder_user_name', v)} />
            </AdminField>
            <AdminField label="join_mode">
              <AdminSelectFilter
                value={query.join_mode ?? ''}
                onChange={(v) => setFilter('join_mode', v)}
                options={[
                  { value: '', label: txt('all') },
                  { value: Group_Join_Mode.PUBLIC, label: 'PUBLIC' },
                  { value: Group_Join_Mode.BY_REQUEST, label: 'BY_REQUEST' },
                ]}
              />
            </AdminField>
            <AdminField label="view_mode">
              <AdminSelectFilter
                value={query.view_mode ?? ''}
                onChange={(v) => setFilter('view_mode', v)}
                options={[
                  { value: '', label: txt('all') },
                  { value: Group_View_Mode.PUBLIC, label: 'PUBLIC' },
                  { value: Group_View_Mode.PRIVATE, label: 'PRIVATE' },
                ]}
              />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminTextCell value={row.slug} width="max-w-[150px]" />
            <AdminTextCell value={row.name} width="max-w-[190px]" />
            <AdminTextCell value={row.founder?.user_name} width="max-w-[130px]" />
            <td className="w-[104px] px-3 py-2 align-top text-muted-foreground text-xs">{row.join_mode}</td>
            <td className="w-[90px] px-3 py-2 align-top text-muted-foreground text-xs">{row.view_mode}</td>
            <td className="w-[92px] px-3 py-2 align-top tabular-nums">
              {row.total_member}
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {editing && <EditGroupModal row={editing} onClose={() => setEditing(null)} />}

      {detail && (
        <AdminDetailModal
          title={detail.name}
          subtitle={`${detail.slug} · ${detail.total_member} ${txt('members')}`}
          onClose={() => setDetail(null)}
          fields={[
            { label: 'ID', value: detail.id },
            { label: 'slug', value: detail.slug },
            { label: txt('name'), value: detail.name },
            { label: 'description', value: detail.description, multiline: true },
            { label: txt('founder'), value: detail.founder?.user_name },
            { label: `${txt('founder')} ID`, value: detail.founder?.id },
            { label: 'join_mode', value: detail.join_mode },
            { label: 'view_mode', value: detail.view_mode },
            { label: txt('total_member'), value: detail.total_member },
            { label: txt('created_at'), value: detail.created_at },
            { label: txt('updated_at'), value: detail.updated_at },
            { label: txt('deleted_at'), value: detail.deleted_at },
          ]}
        >
          <h4 className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
            {txt('collections')}
          </h4>
          <GroupCollections groupId={detail.id} />
        </AdminDetailModal>
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
