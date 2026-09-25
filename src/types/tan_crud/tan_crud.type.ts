// ============================================================
// Core
// ============================================================
export type OptimisticMode = 'add' | 'update' | 'remove';

/** Full query key — vd: ['group', id] */
export type QueryKey = string[];

export type DynamicValues = Record<string, string | number>;

// ============================================================
// Optimistic UI config
// ============================================================
export interface OptimisticPageTarget {
    /** Nhiều key — hỗ trợ update nhiều list cùng lúc (move A → B) */
    tags: QueryKey[];
    /** Mode cho page này */
    type: OptimisticMode;
}

export interface OptimisticOneTarget {
    /** Key của single cache — thường 1 */
    tags: QueryKey[];
}

export interface OptimisticUIConfig {
    page?: OptimisticPageTarget[];
    one?: OptimisticOneTarget;
}

// ============================================================
// Update Hook
// ============================================================
export interface UpdateHookOptions<T> {
    onSuccess?: {
        optimisticUI?: OptimisticUIConfig;
        /** Full keys cần invalidate */
        invalidateTags?: QueryKey[];
        onSuccessCallback?: (data: T) => void;
    };
    onMutate?: {
        /** Chạy trước API — dùng data từ variables (id + body) */
        optimisticUI?: OptimisticUIConfig;
        onMutateCallback?: (vars: { id: string; body: Partial<T> }) => void;
    };
    onError?: {
        onErrorCallback?: (err: Error) => void;
    };
}

// ============================================================
// Delete Hook
// ============================================================
export interface DeleteHookOptions<T> {
    onSuccess?: {
        optimisticUI?: OptimisticUIConfig;
        invalidateTags?: QueryKey[];
        /** Xoá hẳn cache */
        deleteTags?: QueryKey[];
        onSuccessCallback?: (id: string) => void;
    };
    onMutate?: {
        optimisticUI?: OptimisticUIConfig;
        onMutateCallback?: (id: string) => void;
    };
    onError?: {
        onErrorCallback?: (err: Error) => void;
    };
}

// ============================================================
// Create Hook
// ============================================================
export interface CreateHookOptions<T> {
    onSuccess?: {
        optimisticUI?: OptimisticUIConfig;
        invalidateTags?: QueryKey[];
        onSuccessCallback?: (data: T) => void;
    };
    onMutate?: {
        /** Không hỗ trợ optimisticUI — chưa có id/data */
        onMutateCallback?: (body: any) => void;
    };
    onError?: {
        invalidateTags?: QueryKey[];
        onErrorCallback?: (err: Error) => void;
    };
}

// ============================================================
// Get hooks
// ============================================================
export interface GetManyConfig<T> {
    queryKey: QueryKey;
    queryFn: (page: number) => Promise<T[]>;
    pageSize?: number;
    enabled?: boolean;
    staleTime?: number;
    // onSuccessCallback?: (data: any) => void;
    // onMutateCallback?: () => void;
    // onErrorCallback?: (err: Error) => void;

}

export interface GetOneConfig<T> {
    queryKey: QueryKey;
    queryFn: () => Promise<T>;
    enabled?: boolean;
    staleTime?: number;

}