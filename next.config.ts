import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';


const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Standalone: đóng gói `.next/standalone` + `node_modules` tối thiểu để chạy
   * bằng `node server.js` mà không cần toàn bộ node_modules.
   *
   * CẦN cho Dockerfile tự build. Vercel tự bỏ qua tham số này (vẫn build bình
   * thường) nên không ảnh hưởng deploy lên Vercel.
   */
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin();


export default withNextIntl(nextConfig);