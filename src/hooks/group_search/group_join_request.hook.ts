'use client';

import { api } from '@/lib/axios/axios';
import {
    useTanCreate,
    useTanDelete,
} from '@/hooks/_share/tan_crud/tan_crud.hook';
import {
    OUTGOING_JOIN_REQUESTS_TAG,
    SEARCH_GROUP_NAME_TAG,
    SEARCH_GROUP_SLUG_TAG,
} from '@/hooks/group_search/group_search.const';
import type {
    CancelJoinRequestVars,
    CreateJoinRequestVars,
    OutgoingJoinRequest,
} from '@/types/group_search/group_search.type';

// Mọi mutation join request đều làm thay đổi 3 cache này:
// danh sách request đã gửi + kết quả search (slug/name) vì có cờ
// `has_pending_request` / `is_joined`.
const AFFECTED_TAGS: string[][] = [
    OUTGOING_JOIN_REQUESTS_TAG,
    SEARCH_GROUP_SLUG_TAG,
    SEARCH_GROUP_NAME_TAG,

    // Bài tập trong nhóm + thông tin nhóm.
    //
    // Thiếu 2 cái này là bug "bấm Join không phản ứng": nhóm PUBLIC thì join
    // xong phải thấy bài ngay, nhóm BY_REQUEST thì banner phải đổi sang trạng
    // thái đã gửi. Không invalidate -> UI đứng im -> người dùng tưởng nút hỏng
    // và bấm liên tục, tạo ra hàng loạt yêu cầu trùng.
    ['posts'],
    ['current_group'],
    ['my_all_group'],
    ['my_own_group'],
];

// ============================================================
// CREATE JOIN REQUEST — POST /group_join_request/:group_id
// ============================================================
export function useCreateJoinRequest() {
    return useTanCreate<void, CreateJoinRequestVars>({
        mutationFn: async ({ group_id }) => {
            await api.post(`group_join_request/${group_id}`);
        },
        options: {
            onSuccess: {
                invalidateTags: AFFECTED_TAGS,
            },
        },
    });
}

// ============================================================
// CANCEL JOIN REQUEST — DELETE /group_join_request/:join_request_id
// ============================================================
export function useCancelJoinRequest() {
    return useTanDelete<OutgoingJoinRequest, CancelJoinRequestVars>({
        mutationFn: async ({ join_request_id }) => {
            await api.delete(`group_join_request/${join_request_id}`);
        },
        getId: (vars) => vars.join_request_id,
        options: {
            onMutate: {
                optimisticUI: {
                    page: [
                        {
                            tags: [OUTGOING_JOIN_REQUESTS_TAG],
                            type: 'remove',
                        },
                    ],
                },
            },
            onSuccess: {
                invalidateTags: AFFECTED_TAGS,
            },
        },
    });
}
