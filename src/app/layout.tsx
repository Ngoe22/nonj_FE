import type { Metadata } from "next";

import "./globals.css";
import { fetchPublicConfig } from "@/lib/api/publicConfig.server";
import TanStackQueryProvider from "@/components/root/layout_root/TanstackQueryProvider.compo";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

/**
 * JetBrains Mono cho TOÀN dự án (đã chốt).
 *
 * Vẫn gán vào biến `--font-sans` để mọi chỗ đang dùng `font-sans` tự động đổi
 * theo, không phải sửa từng component.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
});


/**
 * Metadata gốc: tiêu đề + FAVICON.
 *
 * Favicon lấy từ cấu hình admin (`/admin/config`). Nếu admin chưa đặt hoặc BE
 * lỗi thì trả `icons: undefined` -> Next dùng `app/favicon.ico` mặc định.
 */
export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchPublicConfig();
  const favicon = config?.favicon_url?.trim();

  return {
    title: 'NONJ',
    icons: favicon
      ? { icon: favicon, shortcut: favicon, apple: favicon }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", jetbrainsMono.variable)} suppressHydrationWarning>

    <head>
        <script
            dangerouslySetInnerHTML={{
                __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
            }}
        />
    </head>
    <body>
      <TanStackQueryProvider>
          {children}

      </TanStackQueryProvider>
      </body>
    </html>
  );
}
