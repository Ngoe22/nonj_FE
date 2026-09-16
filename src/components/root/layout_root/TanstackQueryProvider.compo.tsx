// src/components/providers/QueryProvider.tsx

'use client';

import { useState } from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

export default function TanStackQueryProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () => new QueryClient()
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}