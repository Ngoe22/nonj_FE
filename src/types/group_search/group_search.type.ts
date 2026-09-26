import type { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';

// ============================================================
// Search
// ============================================================
export type SearchGroupMode = 'slug' | 'name';

export interface SearchGroup {
    id: string;
    name: string;
    slug: string;
    description: string;
    join_mode: Group_Join_Mode;
    view_mode: Group_View_Mode;
    is_joined: boolean;
    has_pending_request: boolean;
    permission: {
        view_setting: boolean;
        view_join_req: boolean;
        view_member: boolean;
        edit_setting: boolean;
        able_to_leave: boolean;
        able_to_delete: boolean;
        create_collection: boolean;
    };
}

// ============================================================
// Outgoing request
// ============================================================
export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OutgoingJoinRequest {
    id: string;
    group: {
        id: string;
        slug: string;
        name: string;
    };
    status: JoinRequestStatus;
    created_at: string;
}

// ============================================================
// Mutation vars
// ============================================================
export interface CreateJoinRequestVars {
    group_id: string;
}

export interface CancelJoinRequestVars {
    join_request_id: string;
    group_id: string;
}