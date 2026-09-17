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
    <html lang="vi" className={cn("font-sans", figtree.variable)}>
      <body>
      <TanStackQueryProvider>
          {children}

      </TanStackQueryProvider>
      </body>
    </html>
  );
}
