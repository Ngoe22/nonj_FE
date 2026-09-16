import "./globals.css";
import TanStackQueryProvider from "@/components/root/layout_root/TanstackQueryProvider.compo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
      <TanStackQueryProvider>
          {children}

      </TanStackQueryProvider>
      </body>
    </html>
  );
}
