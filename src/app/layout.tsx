import "./globals.css";
import TanStackQueryProvider from "@/components/root/layout_root/TanstackQueryProvider.compo";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", figtree.variable)} suppressHydrationWarning>

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
