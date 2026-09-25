
// ============================================================
// Optimistic
// ============================================================
export type OptimisticMode = 'add' | 'update' | 'remove';

export type QueryKey = string[];

export interface OptimisticPageTarget {
    /** Nhiều key cùng lúc — vd: move item A → B */
    tags: QueryKey[];
    type: OptimisticMode;
}

export interface OptimisticOneTarget {
    tags: QueryKey[];
}

export interface OptimisticUIConfig {
    page?: OptimisticPageTarget[];
    one?: OptimisticOneTarget;
}

// ============================================================
// Hook options — chung cho mọi mutation
// ============================================================
export interface MutationUIOptions<TData, TVars = any> {
    onMutate?: {
        optimisticUI?: OptimisticUIConfig;
        onMutateCallback?: (vars: TVars) => void;
    };
    onSuccess?: {
        optimisticUI?: OptimisticUIConfig;
        invalidateTags?: QueryKey[];
        deleteTags?: QueryKey[];
        onSuccessCallback?: (data: TData) => void;
    };
    onError?: {
        invalidateTags?: QueryKey[];
        onErrorCallback?: (err: Error) => void;
    };
}

// Alias cho đọc dễ — vẫn cùng shape
export type UpdateHookOptions<T> = MutationUIOptions<T>;
export type DeleteHookOptions<T> = MutationUIOptions<T>;
export type CreateHookOptions<T> = MutationUIOptions<T>;

// ============================================================
// Get many config
// ============================================================
export interface GetManyConfig<T> {
    queryKey: QueryKey;
    queryFn: (page: number) => Promise<T[]>;
    pageSize?: number;
    initialPageParam?: number;
    getNextPageParam?: (lastPage: any, allPages: any[]) => number | undefined;
    enabled?: boolean;
    staleTime?: number;
    /** Cho phép override thêm bất kỳ option nào của useInfiniteQuery */
    [key: string]: any;
}

// ============================================================
// Get one config
// ============================================================
export interface GetOneConfig<T> {
    queryKey: QueryKey;
    queryFn: () => Promise<T>;
    enabled?: boolean;
    staleTime?: number;
    /** Cho phép override thêm bất kỳ option nào của useQuery */
    [key: string]: any;
}