import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';


const nextConfig: NextConfig = {
  /**
   * ⚠️ KHÔNG bật React Compiler (`reactCompiler: true`).
   *
   * React Compiler KHÔNG tương thích với react-hook-form: có bug đã biết là
   * thay đổi `formState.errors` không làm component con re-render (chỉ xuất hiện
   * ở BẢN BUILD production, dev thì chạy đúng). Hệ quả đã gặp thực tế: nhập vào
   * ô Tiêu đề của modal "Tạo thư mục" mà lỗi "Vui lòng nhập tiêu đề" không tự
   * mất, submit mãi không được.
   *
   * Tham khảo:
   * - react-hook-form#13505 — "with React compiler, a change in formState errors
   *   does not cause child components to re-render"
   * - react-hook-form#12524 (React Compiler support) + react#37149
   *
   * Standalone: đóng gói `.next/standalone` + `node_modules` tối thiểu để chạy
   * bằng `node server.js` mà không cần toàn bộ node_modules.
   *
   * CẦN cho Dockerfile tự build. Vercel tự bỏ qua tham số này (vẫn build bình
   * thường) nên không ảnh hưởng deploy lên Vercel.
   */
  output: 'standalone',

  /**
   * Header bảo mật.
   *
   * `Cross-Origin-Opener-Policy: same-origin-allow-popups` là KHUYẾN NGHỊ CHÍNH
   * THỨC của Google cho trang dùng Google Identity Services:
   *
   *   popup đăng nhập của Google (`accounts.google.com`) chạy ở origin khác và
   *   gửi kết quả về trang mình bằng `window.postMessage`. Nếu trang đặt COOP ở
   *   mức chặt (`same-origin`) thì trình duyệt CHẶN postMessage đó -> đăng nhập
   *   Google im lặng không chạy, chỉ hiện cảnh báo:
   *   "Cross-Origin-Opener-Policy policy would block the window.postMessage call".
   *
   * `same-origin-allow-popups` giữ được kênh postMessage cho popup mà vẫn cô lập
   * với các cửa sổ khác.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();


export default withNextIntl(nextConfig);
