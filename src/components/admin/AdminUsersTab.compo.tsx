'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Ban, CheckCircle2, FolderTree, Pencil } from 'lucide-react';

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
    useAdminCollectionPreparations,
    useAdminUpdateUser,
    useAdminUserCollections,
    useAdminUsers,
} from '@/hooks/admin/admin.hook';
import { Admin_User_Status, type AdminUser } from '@/types/admin/admin.type';

// ============================================================
// Modal tra cứu: bộ sưu tập ĐỀ CÁ NHÂN của user + đề bên trong
// ============================================================

function UserCollectionsModal({
    user,
    onClose,
}: {
    user: AdminUser | null;
    onClose: () => void;
}) {
    const txt = useTranslations('Admin');
    const [openCollectionId, setOpenCollectionId] = useState('');

    const { data: collections, isLoading } = useAdminUserCollections(
        user?.id ?? '',
        !!user,
    );

    const { data: preparations, isLoading: loadingPreparations } =
        useAdminCollectionPreparations(
            user?.id ?? '',
            openCollectionId,
            !!user && !!openCollectionId,
        );

    return (
        <Dialog open={!!user} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92dvh] w-[95vw] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {txt('user_preparations')} · {user?.user_name}
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
                            className="rounded-xl border border-border bg-surface"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenCollectionId(
                                        openCollectionId === collection.id
                                            ? ''
                                            : collection.id,
                                    )
                                }
                                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                            >
                                <FolderTree
                                    size={15}
                                    className="shrink-0 text-muted-foreground"
                                />
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {collection.title}
                                </span>
                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {openCollectionId === collection.id
                                        ? '−'
                                        : '+'}
                                </span>
                            </button>

                            {openCollectionId === collection.id && (
                                <div className="border-t border-border px-4 py-2">
                                    {loadingPreparations ? (
                                        <p className="py-2 text-xs text-muted-foreground">
                                            {txt('loading')}
                                        </p>
                                    ) : (preparations?.length ?? 0) === 0 ? (
                                        <p className="py-2 text-xs text-muted-foreground">
                                            {txt('empty')}
                                        </p>
                                    ) : (
                                        (preparations ?? []).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-2 py-1.5 text-sm"
                                            >
                                                <span className="min-w-0 flex-1 truncate">
                                                    {item.title}
                                                </span>
                                                <span className="shrink-0 text-[11px] text-muted-foreground">
                                                    {item.content?.length ?? 0}{' '}
                                                    {txt('sections')}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </AdminListShell>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================
// Tab Users
// ============================================================

export default function AdminUsersTab() {
    const txt = useTranslations('Admin');

    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<AdminUser | null>(null);
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [banning, setBanning] = useState<AdminUser | null>(null);

    const { data: users, isLoading } = useAdminUsers(page);
    const updateUser = useAdminUpdateUser();

    const openEdit = (user: AdminUser) => {
        setEditing(user);
        setEditName(user.nickname ?? '');
        setEditBio(user.bio ?? '');
    };

    const submitEdit = async () => {
        if (!editing) return;
        await updateUser.mutateAsync({
            user_id: editing.id,
            body: { nickname: editName, bio: editBio },
        });
        setEditing(null);
    };

    const toggleBan = async () => {
        if (!banning) return;
        const nextStatus =
            banning.status === Admin_User_Status.BANNED
                ? Admin_User_Status.ACTIVE
                : Admin_User_Status.BANNED;
        await updateUser.mutateAsync({
            user_id: banning.id,
            body: { status: nextStatus },
        });
        setBanning(null);
    };

    return (
        <>
            <AdminListShell
                isLoading={isLoading}
                isEmpty={(users?.length ?? 0) === 0}
                emptyText={txt('empty')}
            >
                {(users ?? []).map((user) => (
                    <div
                        key={user.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {user.nickname}{' '}
                                <span className="text-muted-foreground">
                                    @{user.user_name}
                                </span>
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </p>
                        </div>

                        {user.role === 'SYSTEM_ADMIN' && (
                            <Badge variant="secondary">
                                {txt('role_admin')}
                            </Badge>
                        )}

                        <Badge
                            variant="secondary"
                            className={
                                user.status === Admin_User_Status.BANNED
                                    ? 'text-red-600'
                                    : ''
                            }
                        >
                            {user.status === Admin_User_Status.BANNED
                                ? txt('status_banned')
                                : txt('status_active')}
                        </Badge>

                        <div className="flex shrink-0 gap-1.5">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => setSelected(user)}
                            >
                                <FolderTree size={13} />
                                {txt('view_preparations')}
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => openEdit(user)}
                            >
                                <Pencil size={13} />
                                {txt('edit')}
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-red-600 hover:bg-red-50"
                                onClick={() => setBanning(user)}
                            >
                                {user.status === Admin_User_Status.BANNED ? (
                                    <CheckCircle2 size={13} />
                                ) : (
                                    <Ban size={13} />
                                )}
                                {user.status === Admin_User_Status.BANNED
                                    ? txt('unban')
                                    : txt('ban')}
                            </Button>
                        </div>
                    </div>
                ))}
            </AdminListShell>

            <AdminPager
                page={page}
                count={users?.length ?? 0}
                onPage={setPage}
            />

            <UserCollectionsModal
                user={selected}
                onClose={() => setSelected(null)}
            />

            {/* Sửa nickname/bio */}
            <Dialog
                open={!!editing}
                onOpenChange={(value) => !value && setEditing(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {txt('edit')} · {editing?.user_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('nickname')}
                            </label>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-md border-2 border-status-info p-2 text-sm outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('bio')}
                            </label>
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="min-h-20 w-full resize-y rounded-md border-2 border-status-info p-2 text-sm outline-none"
                            />
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
                                disabled={updateUser.isPending}
                            >
                                {updateUser.isPending
                                    ? txt('saving')
                                    : txt('confirm')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                open={!!banning}
                title={
                    banning?.status === Admin_User_Status.BANNED
                        ? txt('unban')
                        : txt('ban')
                }
                description={txt('confirm_ban')}
                onClose={() => setBanning(null)}
                onConfirm={toggleBan}
            />
        </>
    );
}
