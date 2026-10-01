'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FolderTree, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';
import {
    AdminListShell,
    AdminPager,
} from '@/components/admin/_share/AdminPager.compo';

import {
    useAdminDeleteCollection,
    useAdminDeleteGroup,
    useAdminGroupCollections,
    useAdminGroups,
    useAdminUpdateGroup,
} from '@/hooks/admin/admin.hook';
import {
    Group_Join_Mode,
    Group_View_Mode,
} from '@/enum/group/group_mode.enum';
import type { AdminGroup } from '@/types/admin/admin.type';

const fieldClass =
    'w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

// ============================================================
// Modal: bộ sưu tập bài tập của nhóm
// ============================================================

function GroupCollectionsModal({
    group,
    onClose,
    onOpenCollection,
}: {
    group: AdminGroup | null;
    onClose: () => void;
    onOpenCollection: (collectionId: string) => void;
}) {
    const txt = useTranslations('Admin');
    const [deleting, setDeleting] = useState<string | null>(null);

    const { data: collections, isLoading } = useAdminGroupCollections(
        group?.id ?? '',
        !!group,
    );
    const deleteCollection = useAdminDeleteCollection();

    return (
        <Dialog open={!!group} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92dvh] w-[95vw] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {txt('group_collections')} · {group?.name}
                    </DialogTitle>
                </DialogHeader>

                <AdminListShell
                    isLoading={isLoading}
                    isEmpty={(collections?.length ?? 0) === 0}
                    emptyText={txt('empty')}
                >
                    {(collections ?? []).map((collection) => (
                        <div
                            key={collection.id}
                            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                        >
                            <FolderTree
                                size={15}
                                className="shrink-0 text-muted-foreground"
                            />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                {collection.title}
                            </span>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    onOpenCollection(collection.id);
                                    onClose();
                                }}
                            >
                                {txt('view_posts')}
                            </Button>

                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                onClick={() => setDeleting(collection.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    ))}
                </AdminListShell>

                <ConfirmModal
                    open={!!deleting}
                    title={txt('delete')}
                    description={txt('confirm_delete_collection')}
                    onClose={() => setDeleting(null)}
                    onConfirm={async () => {
                        if (deleting) {
                            await deleteCollection.mutateAsync(deleting);
                        }
                        setDeleting(null);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

// ============================================================
// Tab Groups
// ============================================================

export default function AdminGroupsTab({
    onOpenCollection,
}: {
    onOpenCollection: (collectionId: string) => void;
}) {
    const txt = useTranslations('Admin');

    const [page, setPage] = useState(1);
    const [viewing, setViewing] = useState<AdminGroup | null>(null);
    const [editing, setEditing] = useState<AdminGroup | null>(null);
    const [deleting, setDeleting] = useState<AdminGroup | null>(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        join_mode: Group_Join_Mode.BY_REQUEST as Group_Join_Mode,
        view_mode: Group_View_Mode.PRIVATE as Group_View_Mode,
    });

    const { data: groups, isLoading } = useAdminGroups(page);
    const updateGroup = useAdminUpdateGroup();
    const deleteGroup = useAdminDeleteGroup();

    const openEdit = (group: AdminGroup) => {
        setEditing(group);
        setForm({
            name: group.name ?? '',
            description: group.description ?? '',
            join_mode: group.join_mode,
            view_mode: group.view_mode,
        });
    };

    const submitEdit = async () => {
        if (!editing) return;
        await updateGroup.mutateAsync({
            group_id: editing.id,
            body: form,
        });
        setEditing(null);
    };

    return (
        <>
            <AdminListShell
                isLoading={isLoading}
                isEmpty={(groups?.length ?? 0) === 0}
                emptyText={txt('empty')}
            >
                {(groups ?? []).map((group) => (
                    <div
                        key={group.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {group.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                /{group.slug}
                                {group.founder
                                    ? ` · @${group.founder.user_name ?? ''}`
                                    : ''}
                            </p>
                        </div>

                        <Badge variant="secondary">
                            {group.join_mode === Group_Join_Mode.PUBLIC
                                ? txt('join_public')
                                : txt('join_by_request')}
                        </Badge>
                        <Badge variant="secondary">
                            {group.view_mode === Group_View_Mode.PUBLIC
                                ? txt('view_public')
                                : txt('view_private')}
                        </Badge>

                        <div className="flex shrink-0 gap-1.5">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => setViewing(group)}
                            >
                                <FolderTree size={13} />
                                {txt('view_collections')}
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => openEdit(group)}
                            >
                                <Pencil size={13} />
                                {txt('edit')}
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-red-600 hover:bg-red-50"
                                onClick={() => setDeleting(group)}
                            >
                                <Trash2 size={13} />
                                {txt('delete')}
                            </Button>
                        </div>
                    </div>
                ))}
            </AdminListShell>

            <AdminPager
                page={page}
                count={groups?.length ?? 0}
                onPage={setPage}
            />

            <GroupCollectionsModal
                group={viewing}
                onClose={() => setViewing(null)}
                onOpenCollection={onOpenCollection}
            />

            {/* Sửa nhóm */}
            <Dialog
                open={!!editing}
                onOpenChange={(value) => !value && setEditing(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {txt('edit')} · {editing?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('group_name')}
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('group_description')}
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                                className={`${fieldClass} min-h-20 resize-y`}
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('join_mode')}
                                </label>
                                <select
                                    value={form.join_mode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            join_mode: e.target
                                                .value as Group_Join_Mode,
                                        })
                                    }
                                    className={fieldClass}
                                >
                                    <option value={Group_Join_Mode.BY_REQUEST}>
                                        {txt('join_by_request')}
                                    </option>
                                    <option value={Group_Join_Mode.PUBLIC}>
                                        {txt('join_public')}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('view_mode')}
                                </label>
                                <select
                                    value={form.view_mode}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            view_mode: e.target
                                                .value as Group_View_Mode,
                                        })
                                    }
                                    className={fieldClass}
                                >
                                    <option value={Group_View_Mode.PRIVATE}>
                                        {txt('view_private')}
                                    </option>
                                    <option value={Group_View_Mode.PUBLIC}>
                                        {txt('view_public')}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditing(null)}
                            >
                                {txt('cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={submitEdit}
                                disabled={updateGroup.isPending}
                            >
                                {updateGroup.isPending
                                    ? txt('saving')
                                    : txt('confirm')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                open={!!deleting}
                title={txt('delete')}
                description={txt('confirm_delete_group')}
                onClose={() => setDeleting(null)}
                onConfirm={async () => {
                    if (deleting) await deleteGroup.mutateAsync(deleting.id);
                    setDeleting(null);
                }}
            />
        </>
    );
}
