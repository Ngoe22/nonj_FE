'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import UserInfo from '@/components/_share/user_info/UserInfo.compo';
import {BasicUser} from "@/types/user_info/user_info.type";
import {useTranslations} from "next-intl";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


interface Props <T extends BasicUser = BasicUser> {
    user: T;
    children ?: ReactNode
    onClose: () => void
}


export default function UserDetailModal(
    {  user , children , onClose } :Props
) {

    const txt = useTranslations('Share_component')

    return (
        <Dialog
            open={!!user}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{txt('user_info_title')}</DialogTitle>
                </DialogHeader>

                {user && (
                    <div className="flex flex-col items-center gap-5 pt-3 ">

                        <Avatar className={`h-25 w-25`}>
                            <AvatarImage src={user.avatar_url ?? undefined} alt={user.user_name} />
                            <AvatarFallback className={``}>
                                {user.nickname?.charAt(0).toUpperCase() ?? '?'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 w-full text-center">
                            <p className={'truncate text-2xl font-medium text-foreground'}>
                                {user.nickname}
                            </p>
                            <p className={'truncate text-muted-foreground'}>
                                @{user.user_name}
                            </p>
                            <div className="whitespace-pre-wrap text-sm leading-6 text-foreground rounded-xl bg-surface-hover p-4 mt-2 w-full">
                                {user.bio || '' }
                            </div>

                        </div>
                    </div>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
}