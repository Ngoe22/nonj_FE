'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Camera, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    discardPendingUploads,
    useUploadFile,
} from '@/hooks/upload/use_upload_file.hook';
import { useUpdateMyProfile } from '@/hooks/profile/useUpdateMyProfile.hooks';

interface Props {
    avatar_url: string | null;
    /**
     * Cho phép null/undefined: BE có thể trả user chưa đặt nickname, và lúc đó
     * `nickname.charAt(0)` sẽ ném TypeError làm TRẮNG cả trang /profile.
     */
    nickname?: string | null;
    user_name: string;
    email: string;
}

/**
 * Thẻ thông tin cá nhân — bấm vào ẢNH ĐẠI DIỆN để đổi ảnh.
 *
 * Luồng: chọn file → upload lên R2 (presigned URL) → lưu `avatar_url` qua
 * `PATCH /user/me`. Hai bước nên phải chờ upload xong mới lưu; nếu upload lỗi
 * thì không đụng gì tới profile.
 */
export function MyProfileHeader({ avatar_url, nickname, user_name, email }: Props) {
    const txt = useTranslations('MyProfile');
    const inputRef = useRef<HTMLInputElement>(null);

    const upload = useUploadFile();
    const update = useUpdateMyProfile();

    const busy = upload.isPending || update.isPending;

    const displayName = nickname?.trim() || user_name?.trim() || '';
    const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // reset ngay để chọn lại CÙNG file vẫn kích hoạt onChange
        e.target.value = '';
        if (!file) return;

        try {
            const uploaded = await upload.mutateAsync({
                file,
                fileType: 'image',
                // avatar vào thư mục riêng, KHÔNG lẫn với ảnh câu hỏi
                folder: 'avatars',
            });
            await update.mutateAsync({ avatar_url: uploaded.publicUrl });
            await discardPendingUploads(); // đã tham chiếu -> BE sẽ giữ lại
            toast.success(txt('avatar_updated'));
        } catch {
            // hook upload đã tự hiện toast lỗi (sai định dạng / quá lớn / R2 lỗi).
            //
            // Trường hợp upload THÀNH CÔNG nhưng lưu `avatar_url` thất bại: file
            // vừa đẩy lên R2 thành rác -> xoá ngay. BE chỉ xoá object
            // `ref_count = 0` nên avatar đang dùng sẽ không bị ảnh hưởng.
            void discardPendingUploads();
        }
    };

    return (
        <Card className="mt-6 overflow-hidden">
            <div className="p-5 sm:p-6">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                    {/* Bấm vào ảnh để đổi */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={busy}
                        title={txt('change_avatar')}
                        aria-label={txt('change_avatar')}
                        className="group relative h-24 w-24 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:cursor-wait sm:h-28 sm:w-28"
                    >
                        <Avatar className="h-full w-full">
                            <AvatarImage
                                src={avatar_url ?? undefined}
                                alt={nickname || user_name}
                            />
                            <AvatarFallback className="text-2xl">
                                {initial}
                            </AvatarFallback>
                        </Avatar>

                        {/* Lớp phủ khi hover / khi đang tải */}
                        <span
                            className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/55 text-white transition ${
                                busy
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'
                            }`}
                        >
                            {busy ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Camera size={20} />
                                    <span className="text-[10px] leading-tight">
                                        {txt('change_avatar')}
                                    </span>
                                </>
                            )}
                        </span>
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleSelect}
                        className="hidden"
                    />

                    <div className="min-w-0 text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-foreground">
                            {displayName || '—'}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            @{user_name}
                        </p>

                        <p className="mt-2 break-all text-sm text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
