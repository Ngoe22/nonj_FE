'use client'

import "./globals.css";
import {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
      () => new QueryClient()
  );

  return (
    <html lang="vi">
      <body>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      </body>
    </html>
  );
}
