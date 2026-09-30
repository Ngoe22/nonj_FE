'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, FolderTree, Pencil, Trash2 } from 'lucide-react';

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
    useAdminCollection,
    useAdminCollectionPosts,
    useAdminDeletePost,
    useAdminGroupCollections,
    useAdminGroups,
    useAdminUpdatePost,
} from '@/hooks/admin/admin.hook';
import { formatDeadline } from '@/lib/format/datetime';
import type { AdminPost } from '@/types/admin/admin.type';

const fieldClass =
    'w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

export default function AdminPostsTab({
    initialCollectionId = '',
}: {
    initialCollectionId?: string;
}) {
    const txt = useTranslations('Admin');

    const [groupId, setGroupId] = useState('');
    const [collectionId, setCollectionId] = useState(initialCollectionId);
    const [page, setPage] = useState(1);

    const [editing, setEditing] = useState<AdminPost | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [deleting, setDeleting] = useState<AdminPost | null>(null);

    // chọn nhóm -> sưu tập
    const { data: groups } = useAdminGroups(1);
    const { data: collections, isLoading: loadingCollections } =
        useAdminGroupCollections(groupId, !!groupId && !collectionId);

    // đang xem 1 sưu tập -> hiện bài tập + tên sưu tập (biết nó thuộc nhóm nào)
    const { data: collection } = useAdminCollection(
        collectionId,
        !!collectionId,
    );
    const { data: posts, isLoading: loadingPosts } = useAdminCollectionPosts(
        collectionId,
        page,
        !!collectionId,
    );

    const updatePost = useAdminUpdatePost();
    const deletePost = useAdminDeletePost();

    const openEdit = (post: AdminPost) => {
        setEditing(post);
        setEditTitle(post.title ?? '');
        setEditDescription(post.description ?? '');
    };

    const submitEdit = async () => {
        if (!editing) return;
        await updatePost.mutateAsync({
            post_id: editing.id,
            body: { title: editTitle, description: editDescription },
        });
        setEditing(null);
    };

    // ============================================================
    // Bước 1: chọn nhóm + sưu tập
    // ============================================================
    if (!collectionId) {
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {txt('pick_group_hint')}
                </p>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        {txt('pick_group')}
                    </label>
                    <select
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        className={fieldClass}
                    >
                        <option value="">— {txt('pick_group')} —</option>
                        {(groups ?? []).map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>

                {groupId && (
                    <AdminListShell
                        isLoading={loadingCollections}
                        isEmpty={(collections?.length ?? 0) === 0}
                        emptyText={txt('empty')}
                    >
                        {(collections ?? []).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setCollectionId(item.id);
                                    setPage(1);
                                }}
                                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left hover:bg-surface-hover"
                            >
                                <FolderTree
                                    size={15}
                                    className="shrink-0 text-muted-foreground"
                                />
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {item.title}
                                </span>
                            </button>
                        ))}
                    </AdminListShell>
                )}
            </div>
        );
    }

    // ============================================================
    // Bước 2: bài tập trong sưu tập
    // ============================================================
    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                        setCollectionId('');
                        setPage(1);
                    }}
                >
                    <ArrowLeft size={14} />
                    {txt('back')}
                </Button>

                <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <FolderTree size={14} className="text-muted-foreground" />
                    {collection?.title ?? '—'}
                </span>

                {collection?.group && (
                    <span className="text-xs text-muted-foreground">
                        {txt('in_group')}: {collection.group.name ?? ''}
                    </span>
                )}
            </div>

            <AdminListShell
                isLoading={loadingPosts}
                isEmpty={(posts?.length ?? 0) === 0}
                emptyText={txt('empty')}
            >
                {(posts ?? []).map((post) => (
                    <div
                        key={post.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {post.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {post.user
                                    ? `@${post.user.user_name ?? ''}`
                                    : ''}
                                {post.deadline_at
                                    ? ` · ${txt('deadline')}: ${formatDeadline(post.deadline_at)}`
                                    : ''}
                            </p>
                        </div>

                        <span className="shrink-0 text-[11px] text-muted-foreground">
                            {post.content?.length ?? 0} {txt('sections')}
                        </span>

                        <div className="flex shrink-0 gap-1.5">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => openEdit(post)}
                            >
                                <Pencil size={13} />
                                {txt('edit')}
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-red-600 hover:bg-red-50"
                                onClick={() => setDeleting(post)}
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
                count={posts?.length ?? 0}
                onPage={setPage}
            />

            <Dialog
                open={!!editing}
                onOpenChange={(value) => !value && setEditing(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{txt('edit')}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('post_title')}
                            </label>
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('post_description')}
                            </label>
                            <textarea
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(e.target.value)
                                }
                                className={`${fieldClass} min-h-20 resize-y`}
                            />
                        </div>

                        <p className="rounded-lg border border-dashed border-border p-2 text-[11px] text-muted-foreground">
                            {txt('post_edit_note')}
                        </p>

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
                                disabled={updatePost.isPending}
                            >
                                {updatePost.isPending
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
                description={txt('confirm_delete_post')}
                onClose={() => setDeleting(null)}
                onConfirm={async () => {
                    if (deleting) await deletePost.mutateAsync(deleting.id);
                    setDeleting(null);
                }}
            />
        </>
    );
}
