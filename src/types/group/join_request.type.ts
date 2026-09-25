export enum Group_Join_Request_Status {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}

// Dùng cho request update — chỉ cho phép approve/reject
export enum Group_Join_Request_Status_UPDATE {
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}

export interface JoinRequestSender {
    id: string;
    user_name: string;
    nickname: string;
    avatar_url: string | null;
}

export interface JoinRequest {
    id: string;
    sender: JoinRequestSender;
    status: Group_Join_Request_Status;
    created_time: string;
    _permission: {
        approve: boolean;
        reject: boolean;
    };
}

export interface UpdateJoinRequestVars {
    group_id: string;
    user_id: string;
    join_request_id: string;
    body: {
        status: Group_Join_Request_Status_UPDATE;
    };
}