import type { InfiniteData } from '@tanstack/react-query';

export type OptimisticMode = 'add' | 'update' | 'remove';

export type Snapshot<T> = Array<{
    key: string[];
    old: InfiniteData<T[]> | undefined;
}>;

export type EndpointType =
    | 'getMany'
    | 'getOne'
    | 'createOne'
    | 'updateOne'
    | 'deleteOne';

export interface EndpointDef {
    /** Tag để invalidate/optimistic */
    tag: string;
    /** Loại endpoint — quyết định method signature */
    type: EndpointType;
    /** URL template: 'group/:groupId/collection/:id' */
    endpoint: string;
    /** Key bổ sung khi build queryKey (vd: id của entity cha) */
    keySuffix?: string[];
}

/** Endpoint keys là tuỳ ý — mỗi key = 1 method */
export type Endpoints = Record<string, EndpointDef>;

export type DynamicValues = Record<string, string | number>;

export interface TanCrudConfig<T extends { id: string }> {
    endpoints: Endpoints;
    pageSize?: number;
    transformItem?: (raw: any) => T;
    extraBody?: Record<string, any>;
    staleTime  ?: number
}

export interface MutationOptions {
    dynamicValues?: DynamicValues;
    optimistic?: {
        pagesTag?: string;
        oneTag?: string;
        pagesMode?: OptimisticMode;
        oneMode?: OptimisticMode;
    };
    invalidateTags?: string[];
    invalidateExtraKeys?: string[][];
    removeTags?: string[];
    onSuccessCallback?: (data: any) => void;
    onErrorCallback?: (err: Error) => void;
}

export interface QueryOptions {
    dynamicValues?: DynamicValues;
    extraKeys?: string[];
    enabled?: boolean;
}