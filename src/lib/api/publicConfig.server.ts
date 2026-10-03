/**
 * Đọc cấu hình công khai của BE ở phía SERVER (dùng trong `generateMetadata`).
 *
 * Khác với `useGetPublicConfig` (chạy ở browser), hàm này chạy lúc render
 * server nên phải tự gọi `fetch` và cache lại.
 *
 * - `revalidate: 300` — cache 5 phút. Admin đổi favicon thì tối đa 5 phút sau
 *   người dùng mới thấy; không cần gọi BE mỗi lần render.
 * - LỖI thì trả `null` chứ KHÔNG ném: BE chết cũng không được làm sập trang.
 */
export interface ServerPublicConfig {
    post_max_images: number;
    post_max_audio: number;
    home_text: string;
    contact_facebook: string;
    contact_email: string;
    auth_image_url: string;
    favicon_url: string;
}

export async function fetchPublicConfig(): Promise<ServerPublicConfig | null> {
    const base = (
        process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000'
    ).replace(/\/+$/, '');

    try {
        const res = await fetch(`${base}/config`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data as ServerPublicConfig) ?? null;
    } catch {
        return null;
    }
}
