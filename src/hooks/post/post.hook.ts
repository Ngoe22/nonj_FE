'use client';

import {
    useInfiniteQuery,
    useQuery,
    type InfiniteData,
} from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import {
    useTanCreate,
    useTanDelete,
    useTanUpdate,
} from '@/hooks/_share/tan_crud/tan_crud.hook';
import type {
    CreatePostFromPreparationVars,
    CreatePostVars,
    Post,
    UpdatePostVars,
} from '@/types/post/post.type';

const POST_PAGE_SIZE = 20;

// ============================================================
// Query key — tách list/detail để optimistic UI trỏ ĐÚNG key
// ============================================================

export const postListKey = (groupId: string, collectionId: string) => [
    'posts',
    groupId,
    collectionId,
];

export const postDetailKey = (
    groupId: string,
    collectionId: string,
    postId: string,
) => ['post', groupId, collectionId, postId];

const basePath = (groupId: string, collectionId: string) =>
    `group/${groupId}/collection/${collectionId}/post`;

// ============================================================
// READ
// ============================================================

export function useGetPosts(groupId: string, collectionId: string) {
    return useInfiniteQuery<
        Post[],
        Error,
        InfiniteData<Post[], number>,
        string[],
        number
    >({
        queryKey: postListKey(groupId, collectionId),
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `${basePath(groupId, collectionId)}?page=${pageParam}&limit=${POST_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= POST_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: !!groupId && !!collectionId,
        staleTime: 60 * 1000,
    });
}

export function useGetPost(
    groupId: string,
    collectionId: string,
    postId: string,
) {
    return useQuery<Post | null>({
        queryKey: postDetailKey(groupId, collectionId, postId),
        queryFn: async () => {
            const res = await api.get(
                `${basePath(groupId, collectionId)}/${postId}`,
            );
            return res.data.data;
        },
        enabled: !!groupId && !!collectionId && !!postId,
    });
}

// ============================================================
// CREATE — soạn thủ công
// ============================================================

export function useCreatePost(groupId: string, collectionId: string) {
    const listKey = postListKey(groupId, collectionId);

    return useTanCreate<Post, CreatePostVars>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: Post }>(
                basePath(groupId, collectionId),
                body,
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'add' }],
                },
                invalidateTags: [listKey],
            },
        },
    });
}

// ============================================================
// CREATE — copy từ kho question_preparation (BE copy nội dung)
// ============================================================

export function useCreatePostFromPreparation(
    groupId: string,
    collectionId: string,
) {
    const listKey = postListKey(groupId, collectionId);

    return useTanCreate<Post, CreatePostFromPreparationVars>({
        mutationFn: async (body) => {
            const res = await api.post<{ data: Post }>(
                `${basePath(groupId, collectionId)}/from_preparation`,
                body,
            );
            return res.data.data;
        },
        options: {
            onSuccess: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'add' }],
                },
                invalidateTags: [listKey],
            },
        },
    });
}

// ============================================================
// UPDATE — chỉ title / description / deadline / view_each_other
// ============================================================

/**
 * Sửa bài (title/description/deadline/view_each_other).
 *
 * `postId` là TUỲ CHỌN: truyền vào khi gọi từ trang chi tiết để optimistic cập
 * nhật luôn cache `['post', groupId, collectionId, postId]`.
 *
 * Không truyền thì chỉ optimistic cho danh sách — và `PostDetail` sẽ giữ trạng
 * thái "đang lưu" cho tới khi refetch xong trang chi tiết (chậm thấy rõ).
 */
export function useUpdatePost(
    groupId: string,
    collectionId: string,
    postId?: string,
) {
    const listKey = postListKey(groupId, collectionId);

    return useTanUpdate<Post, UpdatePostVars>({
        mutationFn: async ({ id, body }) => {
            const res = await api.patch<{ data: Post }>(
                `${basePath(groupId, collectionId)}/${id}`,
                body,
            );
            return res.data.data;
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'update' }],
                    // `applyOneAction` khớp key CHÍNH XÁC nên phải có postId
                    ...(postId
                        ? {
                              one: {
                                  tags: [
                                      postDetailKey(
                                          groupId,
                                          collectionId,
                                          postId,
                                      ),
                                  ],
                              },
                          }
                        : {}),
                },
            },
            onSuccess: {
                invalidateTags: [
                    listKey,
                    ['post', groupId, collectionId],
                ],
            },
        },
    });
}

// ============================================================
// DELETE
// ============================================================

export function useDeletePost(groupId: string, collectionId: string) {
    const listKey = postListKey(groupId, collectionId);

    return useTanDelete<Post, string>({
        mutationFn: async (id) => {
            await api.delete(`${basePath(groupId, collectionId)}/${id}`);
        },
        options: {
            onMutate: {
                optimisticUI: {
                    page: [{ tags: [listKey], type: 'remove' }],
                },
            },
            onSuccess: {
                invalidateTags: [listKey],
            },
        },
    });
}
