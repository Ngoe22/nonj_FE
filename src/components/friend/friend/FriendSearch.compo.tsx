'use client';

import {MouseEventHandler, ReactEventHandler, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Search, UserPlus, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import UserInfo from '@/components/_share/user_info/UserInfo.compo';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';

import {
    useSearchUser,
    useAddFriend,
    useUnfriend,
    useCancelFriendRequest,
} from '@/hooks/friend/friend.hook';
import {
    friendSearchSchema,
    friendSearchDefaultValues,
    type FriendSearchFormValues,
} from '@/schemas/friend/friend.schema';
import UserDetailModal from "@/components/_share/user_info/UserDetailModal.compo";
import {ActionButtons} from "@/components/friend/friend/ActionBtn.compo";
import ReportButton from "@/components/_share/report/ReportButton.compo";
import { Target_Type } from "@/enum/report/report.enum";












//=============================================================



export default function FriendSearch() {

    const txt = useTranslations('Friend');

// Keyword đã submit (dùng cho query) — input do react-hook-form giữ
    const [submitted, setSubmitted] = useState('');
    const { data: user, isLoading, isError } = useSearchUser(submitted);


// schema
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FriendSearchFormValues>({
        resolver: zodResolver(friendSearchSchema),
        defaultValues: friendSearchDefaultValues,
        mode: 'onSubmit',
    });
    const submit = handleSubmit((values) => {
        setSubmitted(values.keyword.trim());
    });

// handle click
    const addFriend = useAddFriend();
    const unfriend = useUnfriend();

    const handleAdd = async () => {
        if (!user) return;
        addFriend.mutate({receiver_id: user.id});
    };

    const handleUnfriend = () => {
        if (!user) return;
        unfriend.mutate({ friend_id: user.id });
    };

    const isPending =
        addFriend.isPending || unfriend.isPending ;

    // PHẢI có `isError`: BE ném 404 `user_not_found` và hook đặt `retry:false`
    // nên khi không tìm thấy, `isLoading` = false và `user` = undefined ->
    // `showCard` = false, nhánh `no_user_found` bên trong KHÔNG BAO GIỜ chạy và
    // người dùng không thấy phản hồi gì.
    const showCard = !!submitted && (isLoading || isError || !!user);

    const btn = user ?
    <ActionButtons
        user={user}
        isPending={isPending}
        onAdd={handleAdd}
        onUnfriend={handleUnfriend}
    /> : null


    return (
        <div className="relative">
            <form onSubmit={submit}>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            {...register('keyword')}
                            placeholder={txt('search_pld')}
                            className="h-11 pl-10"
                            autoComplete="off"
                            spellCheck={false}
                        />

                        {errors.keyword && (
                            <div className={'absolute top-1/1 left-0'}>
                                <InvalidInput msg={errors.keyword?.message} />
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        className="h-11 w-11 shrink-0"
                    >
                        <Search size={18} />
                    </Button>
                </div>
            </form>

            {/* Kết quả search */}
            {showCard && (
                <Card className="absolute left-0 right-0 top-14 z-30 p-3 shadow-lg">
                    {isLoading ? (
                        <p className="py-3 text-center text-sm text-muted-foreground">
                            {txt('searching')}
                        </p>
                    ) : !user ? (
                        <p className="py-3 text-center text-sm text-muted-foreground">
                            {txt('no_user_found')}
                        </p>
                    ) : (
                        <UserDetailModal
                            user={user}
                            onClose={ () => setSubmitted('') }
                        >
                            {btn}
                            <ReportButton
                                target_type={Target_Type.USER}
                                target_id={user.id}
                                variant="button"
                            />
                        </UserDetailModal>
                    )}
                </Card>
            )}
        </div>
    );
}
