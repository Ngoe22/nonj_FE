import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import {OptimisticMode, Snapshot} from "@/types/tan_crud/tan_crud.type";

// ============================================================
// Internal list helpers
// ============================================================
function prependInList<T>(old: InfiniteData<T[]> | undefined, newItem: T) {
    if (!old) return old;
    return {
        ...old,
        pages:
            old.pages.length > 0
                ? [[newItem, ...old.pages[0]], ...old.pages.slice(1)]
                : [[newItem]],
    };
}

function updateInList<T extends { id: string }>(
    old: InfiniteData<T[]> | undefined,
    id: string,
    body: Partial<T>,
) {
    if (!old) return old;
    return {
        ...old,
        pages: old.pages.map((page) =>
            page.map((item) => (item.id === id ? { ...item, ...body } : item)),
        ),
    };
}

function removeFromList<T extends { id: string }>(
    old: InfiniteData<T[]> | undefined,
    id: string,
) {
    if (!old) return old;
    return {
        ...old,
        pages: old.pages.map((page) => page.filter((item) => item.id !== id)),
    };
}

// ============================================================
// Optimistic helpers — dùng chung cho class/hook CRUD
// ============================================================

/** Chạy 1 action optimistic lên nhiều infinite key */
export async function optimisticInfinityAction<T extends { id: string }>(
    queryClient: QueryClient,
    queryKeys: string[][],
    action: { mode: OptimisticMode; item?: T; id?: string; body?: Partial<T> },
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
            switch (action.mode) {
                case 'add':
                    return action.item ? prependInList(old, action.item) : old;
                case 'update':
                    return action.id !== undefined
                        ? updateInList(old, action.id, action.body ?? ({} as Partial<T>))
                        : old;
                case 'remove':
                    return action.id !== undefined ? removeFromList(old, action.id) : old;
                default:
                    return old;
            }
        });
    }

    return snapshot;
}

/** Rollback snapshot */
export function rollbackSnapshot<T>(
    queryClient: QueryClient,
    snapshot: Snapshot<T> | undefined,
) {
    snapshot?.forEach(({ key, old }) => {
        queryClient.setQueryData(key, old);
    });
}