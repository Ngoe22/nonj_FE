import "./globals.css";
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
        <title>NONJ</title>
    </head>
    <body>
      <TanStackQueryProvider>
          {children}

      </TanStackQueryProvider>
      </body>
    </html>
  );
}
