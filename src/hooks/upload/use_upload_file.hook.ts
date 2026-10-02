'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

import { api } from '@/lib/axios/axios';
import type {
    UploadFileResponse,
    UploadFileType,
} from '@/types/upload/upload.type';

interface UploadVars {
    file: File;
    fileType: UploadFileType;
    /**
     * Thư mục lưu trên R2 (vd `avatars`). Bỏ trống thì BE tự chọn theo `fileType`.
     * Giá trị phải nằm trong `STORAGE_FOLDER` của BE, nếu không BE trả 400.
     */
    folder?: string;
}

/**
 * Theo dõi các object VỪA upload trong phiên soạn hiện tại.
 *
 * Vì sao cần: file được đẩy thẳng lên R2 ngay lúc chọn (presigned URL), nên nếu
 * người dùng upload ảnh/mp3 rồi bấm Huỷ hoặc đóng form mà KHÔNG lưu, file vẫn
 * nằm trên cloud. Cron 7 ngày có dọn, nhưng để lâu vừa tốn dung lượng vừa khó
 * hiểu. Với danh sách này, FE gọi `storage/discard` để xoá NGAY khi đóng form.
 *
 * An toàn: BE chỉ xoá object `ref_count === 0` -> file đã được bài nào đó dùng
 * sẽ không bị xoá kể cả khi ta gọi nhầm.
 */
const pendingUploadKeys = new Set<string>();

/** Ghi nhận 1 object vừa upload xong */
function trackPendingUpload(key: string): void {
    if (key) pendingUploadKeys.add(key);
}

/** Phiên soạn mới -> quên các key của phiên trước */
export function clearPendingUploads(): void {
    pendingUploadKeys.clear();
}

/**
 * Xoá các file vừa upload mà không dùng tới (gọi khi đóng form KHÔNG lưu).
 * Lỗi mạng thì bỏ qua im lặng — cron 7 ngày vẫn dọn.
 */
export async function discardPendingUploads(): Promise<void> {
    const keys = [...pendingUploadKeys];
    pendingUploadKeys.clear();
    if (keys.length === 0) return;

    try {
        await api.post('storage/discard', { keys });
    } catch {
        // im lặng: cron phía BE sẽ dọn sau
    }
}

export function useUploadFile() {
    const txt = useTranslations('Toast');

    return useMutation<UploadFileResponse, Error, UploadVars>({
        mutationFn: async ({ file, fileType, folder }) => {
            // 1. Validate
            const isImage = file.type.startsWith('image/');
            const isAudio = file.type.startsWith('audio/');

            if (fileType === 'image' && !isImage) {
                throw new Error('invalid_image_type');
            }
            if (fileType === 'audio' && !isAudio) {
                throw new Error('invalid_audio_type');
            }

            const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error(fileType === 'image' ? 'image_too_large' : 'audio_too_large');
            }

            // 2. Lấy presigned URL từ BE
            //    - PHẢI gửi `fileType` (BE validate); `folder` BE tự suy ra
            //    - response bị TransformInterceptor bọc nên phải đi qua .data.data
            const res = await api.post<{ data: UploadFileResponse }>(
                'storage/upload-url',
                {
                    fileName: file.name,
                    contentType: file.type,
                    fileType,
                    ...(folder ? { folder } : {}),
                },
            );
            const urlData = res.data.data;

            // 3. Upload trực tiếp lên R2
            const uploadRes = await fetch(urlData.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadRes.ok) throw new Error('upload_failed');

            // Upload xong nhưng CHƯA chắc được dùng -> theo dõi để xoá nếu người
            // dùng đóng form mà không lưu.
            trackPendingUpload(urlData.key);

            return urlData;
        },

        onError: (err) => {
            const code = err.message;

            const msgMap: Record<string, string> = {
                invalid_image_type: txt('invalid_image_type'),
                invalid_audio_type: txt('invalid_audio_type'),
                image_too_large: txt('image_too_large'),
                audio_too_large: txt('audio_too_large'),
                upload_failed: txt('upload_failed'),
                // BE trả 503 kèm mã này khi chưa cấu hình R2
                storage_not_configured: txt('storage_not_configured'),
            };

            toast.error(msgMap[code] ?? txt('upload_failed'));
        },
    });
}