'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';

/** Cấu hình công khai mà FE được đọc (admin sửa trong trang /admin/config) */
export interface PublicConfig {
    /** Giới hạn ảnh / bài */
    post_max_images: number;
    /** Giới hạn mp3 / bài */
    post_max_audio: number;
    /** Đoạn giới thiệu trên trang chủ (rỗng = ẩn) */
    home_text: string;
    /** Link Facebook liên hệ (rỗng = ẩn) */
    contact_facebook: string;
    /** Email liên hệ (rỗng = ẩn) */
    contact_email: string;
}

export const PUBLIC_CONFIG_KEY = ['public_config'] as const;

/**
 * Cấu hình công khai — endpoint `/config`, KHÔNG cần đăng nhập.
 *
 * Dùng cho cả bộ đếm "đã upload X/Y" ở editor lẫn nội dung trang chủ.
 */
export function useGetPublicConfig() {
    return useQuery<PublicConfig>({
        queryKey: PUBLIC_CONFIG_KEY,
        queryFn: async () => {
            const res = await api.get<{ data: PublicConfig }>('config');
            return res.data.data;
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Chỉ lấy phần giới hạn ảnh/mp3 cho editor.
 * Cùng queryKey với `useGetPublicConfig` nên dùng CHUNG cache, không gọi 2 lần.
 */
export function useGetMediaLimits() {
    return useGetPublicConfig();
}
