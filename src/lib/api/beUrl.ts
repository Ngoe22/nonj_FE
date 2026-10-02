/**
 * URL gốc của BE — MỘT chỗ duy nhất, dùng cho cả axios lẫn socket.io.
 *
 * Vì sao cần gom:
 *  - Trước đây mỗi nơi tự đọc `process.env.NEXT_PUBLIC_BE_URL` với fallback
 *    khác nhau (`axios.ts` fallback cổng **4000** — sai, BE chạy 3000).
 *  - Vercel cho nhập env khá thoải mái: chỉ cần lỡ tay thêm `/` ở cuối
 *    (`https://api.nonj.site/`) là axios ghép thành
 *    `https://api.nonj.site//auth/login` và socket thành URL sai. Cắt ở đây
 *    một lần cho tất cả.
 */
export function getBeUrl(): string {
  return (process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000').replace(
    /\/+$/,
    '',
  );
}
