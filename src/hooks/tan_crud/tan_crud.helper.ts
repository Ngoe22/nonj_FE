import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import {OptimisticMode, OptimisticUIConfig} from "@/types/tan_crud/tan_crud.type";


// ============================================================
// Cache snapshot
// ============================================================
export interface CacheSnapshot {
    key: string[];
    data: unknown;
}

export async function prepareOptimistic(
    queryClient: QueryClient,
    keys: string[][],
): Promise<CacheSnapshot[]> {
    await Promise.all(
        keys.map((k) => queryClient.cancelQueries({ queryKey: k })),
    );
    return keys.map((key) => ({
        key,
        data: queryClient.getQueryData(key),
    }));
}

export function rollback(queryClient: QueryClient, snapshots: CacheSnapshot[]) {
    for (const { key, data } of snapshots) {
        queryClient.setQueryData(key, data);
    }
}

// ============================================================
// Page-level operations (InfiniteData)
// ============================================================
function addToPage<T>(page: T[], item: T): T[] {
    return [item, ...page];
}

function updateInPage<T extends { id: string }>(
    page: T[],
    id: string,
    body: Partial<T>,
): T[] {
    return page.map((i) => (i.id === id ? { ...i, ...body } : i));
}

function removeFromPage<T extends { id: string }>(page: T[], id: string): T[] {
    return page.filter((i) => i.id !== id);
}

export function applyInfiniteAction<T extends { id: string }>(
    queryClient: QueryClient,
    key: string[],
    action: {
        mode: OptimisticMode;
        item?: T;
        id?: string;
        body?: Partial<T>;
    },
) {
    queryClient.setQueryData<InfiniteData<T[]>>(key, (old) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map((page) => {
                switch (action.mode) {
                    case 'add':
                        return action.item ? addToPage(page, action.item) : page;
                    case 'update':
                        return action.id !== undefined
                            ? updateInPage(page, action.id, action.body ?? ({} as Partial<T>))
                            : page;
                    case 'remove':
                        return action.id !== undefined
                            ? removeFromPage(page, action.id)
                            : page;
                    default:
                        return page;
                }
            }),
        };
    });
}

// ============================================================
// One-level operations (single cache)
// ============================================================
export function applyOneAction<T>(
    queryClient: QueryClient,
    key: string[],
    action: {
        mode: OptimisticMode;
        item?: T;
        body?: Partial<T>;
    },
) {
    switch (action.mode) {
        case 'remove':
            queryClient.removeQueries({ queryKey: key });
            return;
        case 'update':
            queryClient.setQueryData<T>(key, (old) =>
                old ? { ...old, ...action.body } : old,
            );
            return;
        case 'add':
            if (action.item) queryClient.setQueryData<T>(key, action.item);
            return;
    }
}

// ============================================================
// Apply toàn bộ OptimisticUI config
// ============================================================
export function applyOptimisticUI<T extends { id: string }>(
    queryClient: QueryClient,
    config: OptimisticUIConfig,
    context: {
        id?: string;
        body?: Partial<T>;
        item?: T;
        oneMode: OptimisticMode;
    },
) {
    // ----- Page targets -----
    if (config.page) {
        for (const target of config.page) {
            for (const key of target.tags) {
                applyInfiniteAction<T>(queryClient, key, {
                    mode: target.type,
                    id: context.id,
                    body: context.body,
                    item: context.item,
                });
            }
        }
    }

    // ----- One target -----
    if (config.one) {
        for (const key of config.one.tags) {
            applyOneAction<T>(queryClient, key, {
                mode: context.oneMode,
                item: context.item,
                body: context.body,
            });
        }
    }
}

// ============================================================
// Collect tất cả key có trong OptimisticUI config
// ============================================================
export function collectKeys(config?: OptimisticUIConfig): string[][] {
    if (!config) return [];
    const keys: string[][] = [];
    if (config.page) {
        for (const target of config.page) keys.push(...target.tags);
    }
    if (config.one) {
        keys.push(...config.one.tags);
    }
    return keys;
}

// ============================================================
// Invalidate / Remove
// ============================================================
export function invalidateKeys(
    queryClient: QueryClient,
    keys: string[][],
): Promise<void[]> {
    return Promise.all(
        keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
    );
}

export function removeKeys(
    queryClient: QueryClient,
    keys: string[][],
): Promise<void[]> {
    return Promise.all(
        keys.map((key) => queryClient.removeQueries({ queryKey: key })),
    );
}