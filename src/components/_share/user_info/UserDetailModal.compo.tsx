'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import UserInfo from '@/components/_share/user_info/UserInfo.compo';
import { useUserModalStore } from '@/stores/user_info/user_modal.store';

export default function UserDetailModal() {
    const user = useUserModalStore((s) => s.user);
    const closeModal = useUserModalStore((s) => s.closeModal);

    return (
        <Dialog open={!!user} onOpenChange={(v) => !v && closeModal()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Thông tin người dùng</DialogTitle>
                </DialogHeader>

                {user && (
                    <div className="flex flex-col items-center gap-5 pt-3">
                        <UserInfo
                            user={user}
                            size="lg"
                            layout="col"
                            disableClick
                        />

                        {user.bio && (
                            <div className="w-full rounded-xl border border-border bg-surface p-3">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Bio
                                </p>
                                <p className="mt-1 text-sm">{user.bio}</p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}