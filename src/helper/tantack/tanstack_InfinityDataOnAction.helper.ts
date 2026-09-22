import type { InfiniteData, QueryClient } from '@tanstack/react-query';

/** Snapshot trả về để onError tự rollback */
export type Snapshot<T> = Array<{
    key: string[];
    old: InfiniteData<T[]> | undefined;
}>;

// ============================================================
// CREATE — prepend vào page đầu
// ============================================================
export async function optimisticCreate<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    newItem: T,
): Promise<Snapshot<T>> {
    // 1. Cancel queries đang chạy
    await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
    );

    // 2. Lưu old data để rollback
    const snapshot: Snapshot<T> = queryKeys.map((key) => ({
        key,
        old: queryClient.getQueryData<InfiniteData<T[]>>(key),
    }));

    // 3. Set data mới
    for (const key of queryKeys) {
        queryClient.setQueryData<InfiniteData<T[]>>(key, (old) => {
            if (!old) return old;
            return {
                ...old,
                pages:
                    old.pages.length > 0
                        ? [[newItem, ...old.pages[0]], ...old.pages.slice(1)]
                        : [[newItem]],
            };
        });
    }

    return snapshot;
}

// ============================================================
// UPDATE — tìm theo id, merge body
// ============================================================
export async function optimisticUpdate<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    id: string,
    body: Partial<T>,
): Promise<Snapshot<T>> {
    await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
    );

    const snapshot: Snapshot<T> = queryKeys.map((key) => ({
        key,
        old: queryClient.getQueryData<InfiniteData<T[]>>(key),
    }));

    for (const key of queryKeys) {
        queryClient.setQueryData<InfiniteData<T[]>>(key, (old) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages.map((page) =>
                    page.map((item) => (item.id === id ? { ...item, ...body } : item)),
                ),
            };
        });
    }

    return snapshot;
}

// ============================================================
// DELETE — xoá theo id khỏi mọi page
// ============================================================
export async function optimisticDelete<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    id: string,
): Promise<Snapshot<T>> {
    await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
    );

    const snapshot: Snapshot<T> = queryKeys.map((key) => ({
        key,
        old: queryClient.getQueryData<InfiniteData<T[]>>(key),
    }));

    for (const key of queryKeys) {
        queryClient.setQueryData<InfiniteData<T[]>>(key, (old) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages.map((page) => page.filter((item) => item.id !== id)),
            };
        });
    }

    return snapshot;
}