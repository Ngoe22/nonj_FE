'use client';

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { api } from '@/lib/axios/axios';
import { postDetailKey } from '@/hooks/post/post.hook';
import type {
    GradeAnswerVars,
    PostAnswer,
    SubmitAnswerVars,
} from '@/types/post_answer/post_answer.type';

const ANSWER_PAGE_SIZE = 20;

const answerBasePath = (
    groupId: string,
    collectionId: string,
    postId: string,
) => `group/${groupId}/collection/${collectionId}/post/${postId}/answer`;

/** Key bài làm CỦA MÌNH — BE trả `null` khi chưa làm */
export const myAnswerKey = (
    groupId: string,
    collectionId: string,
    postId: string,
) => ['post_answer_me', groupId, collectionId, postId];

export const othersAnswersKey = (
    groupId: string,
    collectionId: string,
    postId: string,
) => ['post_answers', groupId, collectionId, postId];

// ============================================================
// READ — bài của mình
// ============================================================

export function useGetMyAnswer(
    groupId: string,
    collectionId: string,
    postId: string,
) {
    return useQuery<PostAnswer | null>({
        queryKey: myAnswerKey(groupId, collectionId, postId),
        queryFn: async () => {
            const res = await api.get(
                `${answerBasePath(groupId, collectionId, postId)}/me`,
            );
            return res.data.data;
        },
        enabled: !!groupId && !!collectionId && !!postId,
    });
}

// ============================================================
// READ — bài của người khác (chỉ khi view_each_other_answer cho phép)
// ============================================================

export function useGetOthersAnswers(
    groupId: string,
    collectionId: string,
    postId: string,
    enabled = true,
) {
    return useInfiniteQuery<
        PostAnswer[],
        Error,
        InfiniteData<PostAnswer[], number>,
        string[],
        number
    >({
        queryKey: othersAnswersKey(groupId, collectionId, postId),
        queryFn: async ({ pageParam }) => {
            const res = await api.get(
                `${answerBasePath(groupId, collectionId, postId)}?page=${pageParam}&limit=${ANSWER_PAGE_SIZE}`,
            );
            return res.data.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length >= ANSWER_PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: enabled && !!groupId && !!collectionId && !!postId,
    });
}

// ============================================================
// SUBMIT — nộp bài (BE tự chấm điểm)
// ============================================================

export function useSubmitAnswer(
    groupId: string,
    collectionId: string,
    postId: string,
) {
    const queryClient = useQueryClient();

    return useMutation<PostAnswer, Error, SubmitAnswerVars>({
        mutationFn: async ({ answer_content }) => {
            const res = await api.post<{ data: PostAnswer }>(
                answerBasePath(groupId, collectionId, postId),
                { answer_content },
            );
            return res.data.data;
        },
        onSuccess: async (data) => {
            // Ghi NGAY bài vừa nộp vào cache TRƯỚC khi invalidate.
            //
            // `invalidateQueries` là refetch ở NỀN và `await` bên dưới khiến
            // `mutateAsync` chỉ resolve SAU khi refetch xong — nên màn thi giữ
            // trạng thái "đang lưu" rất lâu. `setQueryData` cho UI đổi tức thì.
            queryClient.setQueryData(
                myAnswerKey(groupId, collectionId, postId),
                data,
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: myAnswerKey(groupId, collectionId, postId),
                }),
                // post detail phải refetch: member đã làm bài thì BE mới trả
                // thêm `correct_answer`
                queryClient.invalidateQueries({
                    queryKey: postDetailKey(groupId, collectionId, postId),
                }),
                queryClient.invalidateQueries({
                    queryKey: othersAnswersKey(groupId, collectionId, postId),
                }),
            ]);
        },
        onError: () => {
            toast.error('submit_answer_failed');
        },
    });
}

// ============================================================
// RETAKE — làm lại (BE chấm lại từ đầu)
// ============================================================

export function useRetakeAnswer(
    groupId: string,
    collectionId: string,
    postId: string,
) {
    const queryClient = useQueryClient();

    return useMutation<
        PostAnswer,
        Error,
        SubmitAnswerVars & { answer_id: string }
    >({
        mutationFn: async ({ answer_id, answer_content }) => {
            const res = await api.patch<{ data: PostAnswer }>(
                `${answerBasePath(groupId, collectionId, postId)}/retake/${answer_id}`,
                { answer_content },
            );
            return res.data.data;
        },
        onSuccess: async (data) => {
            // Như `useSubmitAnswer`: cập nhật ngay, không chờ refetch
            queryClient.setQueryData(
                myAnswerKey(groupId, collectionId, postId),
                data,
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: myAnswerKey(groupId, collectionId, postId),
                }),
                queryClient.invalidateQueries({
                    queryKey: postDetailKey(groupId, collectionId, postId),
                }),
            ]);
        },
        onError: () => {
            toast.error('retake_failed');
        },
    });
}

// ============================================================
// GRADE — giáo viên chấm phần tự luận
// ============================================================

export function useGradeAnswer(
    groupId: string,
    collectionId: string,
    postId: string,
) {
    const queryClient = useQueryClient();

    // Generic thứ 4 = kiểu context trả về từ `onMutate` (dùng để rollback)
    return useMutation<
        boolean,
        Error,
        GradeAnswerVars,
        { previous: unknown; key: ReturnType<typeof othersAnswersKey> }
    >({
        mutationFn: async ({ answer_id, ...body }) => {
            const res = await api.patch<{ data: boolean }>(
                `${answerBasePath(groupId, collectionId, postId)}/${answer_id}/grade`,
                body,
            );
            return res.data.data;
        },
        onMutate: async ({ answer_id, ...body }) => {
            const key = othersAnswersKey(groupId, collectionId, postId);
            await queryClient.cancelQueries({ queryKey: key });
            const previous = queryClient.getQueryData(key);

            // Sửa NGAY item vừa chấm trong danh sách (infinite -> duyệt từng page)
            queryClient.setQueryData(key, (old: any) => {
                if (!old?.pages) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: PostAnswer[]) =>
                        page.map((a) =>
                            a.id === answer_id ? { ...a, ...body } : a,
                        ),
                    ),
                };
            });

            return { previous, key };
        },
        onError: (_err, _vars, ctx) => {
            // Trả lại dữ liệu cũ nếu chấm lỗi
            if (ctx?.previous !== undefined) {
                queryClient.setQueryData(ctx.key, ctx.previous);
            }
            toast.error('grade_failed');
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: othersAnswersKey(groupId, collectionId, postId),
            });
        },
    });
}
