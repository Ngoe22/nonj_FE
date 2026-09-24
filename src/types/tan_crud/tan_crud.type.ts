import type { InfiniteData, QueryClient } from '@tanstack/react-query';

export type OptimisticMode = 'add' | 'update' | 'remove';

export type Snapshot<T> = Array<{
    key: string[];
    old: InfiniteData<T[]> | undefined;
}>;

export interface CrudEndpoints {
    getMany: string;
    getOne: string;
    createOne: string;
    updateOne: string;
    deleteOne: string;
}

export interface TanCrudConfig<T extends { id: string }> {
    keysOfPages: string[];
    keysOfSingle: string[];
    endpoint: CrudEndpoints;
    /** Tuỳ chọn: transform response BE → item */
    transformItem?: (raw: any) => T;
    /** Tuỳ chọn: số item mỗi page để tính hasNextPage */
    pageSize?: number;
}

// Options cho từng mutation
export interface MutationOptions {

    dynamicValueForEndpoints?: Record<string, string>;

    optimistic?: {
        pages?: OptimisticMode;
        one?: OptimisticMode;
    };
    invalidate?: {
        pages?: boolean;
        one?: boolean;
    };
    onSuccessCallback?: () => void;
    onErrorCallback?: () => void;
}