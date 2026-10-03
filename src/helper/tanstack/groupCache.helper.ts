import type { QueryClient } from '@tanstack/react-query';

/**
 * Xoá TOÀN BỘ cache TanStack của một nhóm.
 *
 * Dùng `predicate` quét theo `group_id` thay vì liệt kê từng key. Cách này
 * quan trọng vì cache của một nhóm nằm rải ở rất nhiều key khác nhau:
 *
 *   ['current_group', groupId]
 *   ['collections', groupId]
 *   ['join_requests', groupId]
 *   ['group_members', groupId]
 *   ['posts', groupId, collectionId]
 *   ['post', groupId, collectionId, postId]
 *   ['my_answer', groupId, collectionId, postId]
 *   ['others_answers', groupId, collectionId, postId]
 *   …
 */
export function clearGroupCache(
    queryClient: QueryClient,
    group_id: string,
): void {
    if (!group_id) return;

    queryClient.removeQueries({
        predicate: (query) => query.queryKey.includes(group_id),
    });
}
