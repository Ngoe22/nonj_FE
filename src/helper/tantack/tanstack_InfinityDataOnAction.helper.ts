import type { InfiniteData, QueryClient } from '@tanstack/react-query';

/** Snapshot trả về để onError tự rollback */
export type Snapshot<T> = Array<{
    key: string[];
    old: InfiniteData<T[]> | undefined;
}>;

 export type optimisticInfinityMode = 'add' | 'remove' | 'update';


// ============ CREATE — prepend vào page đầu ============


const helper = {
    add : prependInList ,
    update : updateInList ,
    remove : removeFromList
}

function prependInList<T>(
    old: InfiniteData<T[]> | undefined,
    newItem: T,
): InfiniteData<T[]> | undefined {
    if (!old) return old;
    return {
        ...old,
        pages:
            old.pages.length > 0
                ? [[newItem, ...old.pages[0]], ...old.pages.slice(1)]
                : [[newItem]],
    };
}

// ============ UPDATE ============
function updateInList<T extends { id: string }>(
    old: InfiniteData<T[]> | undefined,
    id: string,
    body: Partial<T>,
): InfiniteData<T[]> | undefined {
    if (!old) return old;
    return {
        ...old,
        pages: old.pages.map((page) =>
            page.map((item) => (item.id === id ? { ...item, ...body } : item)),
        ),
    };
}

// ============ DELETE ============
function removeFromList<T extends { id: string }>(
    old: InfiniteData<T[]> | undefined,
    id: string,
): InfiniteData<T[]> | undefined {
    if (!old) return old;
    return {
        ...old,
        pages: old.pages.map((page) => page.filter((item) => item.id !== id)),
    };
}


// =====================================================================================================================

// ============================================================
// CREATE — prepend vào page đầu
// ============================================================
export async function optimisticInfinityCreate<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    newItem: T,
    mode = 'add'
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
        queryClient.setQueryData<InfiniteData<T[]>>(key, (old) =>
            prependInList<T>(old, newItem),
        );
    }

    return snapshot;
}

// ============================================================
// UPDATE — tìm theo id, merge body
// ============================================================
export async function optimisticInfinityUpdate<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    id: string,
    body: Partial<T>,
    mode  :  optimisticInfinityMode ='update'
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
            switch (mode) {
                case 'remove' :
                    return removeFromList<T>(old, id)
                default :
                    updateInList(old, id, body)
            }
        });
    }

    return snapshot;
}

// ============================================================
// DELETE — xoá theo id khỏi mọi page
// ============================================================
export async function optimisticInfinityDelete<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    id: string,
    mode  :  optimisticInfinityMode ='remove'
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


