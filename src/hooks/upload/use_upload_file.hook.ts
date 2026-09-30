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
}

export function useUploadFile() {
    const txt = useTranslations('Toast');

    return useMutation<UploadFileResponse, Error, UploadVars>({
        mutationFn: async ({ file, fileType }) => {
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
            };

            toast.error(msgMap[code] ?? txt('upload_failed'));
        },
    });
}