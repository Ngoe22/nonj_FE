'use client';

import { useEffect, useState } from 'react';
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
import { useUserModalStore } from '@/stores/user_info/user_modal.store';

export default function FriendSearch() {
    const txt = useTranslations('Friend');

    // Keyword đã submit (dùng cho query) — input do react-hook-form giữ
    const [submitted, setSubmitted] = useState('');

    const openModal = useUserModalStore((s) => s.openModal);

    const { data: user, isLoading } = useSearchUser(submitted);
    const addFriend = useAddFriend();
    const unfriend = useUnfriend();
    const cancelRequest = useCancelFriendRequest();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FriendSearchFormValues>({
        resolver: zodResolver(friendSearchSchema),
        defaultValues: friendSearchDefaultValues,
        mode: 'onSubmit', // không validate khi blur
    });

    // ✅ Auto mở modal khi search ra user
    useEffect(() => {
        if (user) openModal(user);
    }, [user, openModal]);

    // Validate bằng schema rồi mới cho query chạy
    const submit = handleSubmit((values) => {
        setSubmitted(values.keyword.trim());
    });

    const handleAdd = () => {
        if (!user) return;
        addFriend.mutate({ receiver_id: user.id });
    };

    const handleUnfriend = () => {
        if (!user) return;
        unfriend.mutate({ friend_id: user.id });
    };

    const isPending =
        addFriend.isPending || unfriend.isPending || cancelRequest.isPending;

    const showCard = !!submitted && (isLoading || !!user);

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

                        {/* ✅ Hiện lỗi dưới input */}
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
                        <div className="flex items-center gap-4">
                            <div className="min-w-0 flex-1">
                                <UserInfo
                                    user={user}
                                    onClick={() => openModal(user)}
                                />
                            </div>

                            {user.permission.add_friend && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleAdd}
                                    disabled={isPending}
                                    className="shrink-0"
                                >
                                    <UserPlus size={16} />
                                    {txt('add_friend')}
                                </Button>
                            )}

                            {user.permission.cancel_request_friend && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled
                                    className="shrink-0"
                                >
                                    <Clock size={16} />
                                    {txt('pending')}
                                </Button>
                            )}

                            {user.permission.unfriend && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleUnfriend}
                                    disabled={isPending}
                                    className="shrink-0 text-red-600 hover:bg-red-50"
                                >
                                    <UserMinus size={16} />
                                    {txt('unfriend')}
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
