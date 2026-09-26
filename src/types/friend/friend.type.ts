// ============================================================
// Common user shape
// ============================================================
export interface FriendUser {
    id: string;
    user_name: string;
    nickname: string;
    avatar_url: string | null;
}

export interface FriendUserWithBio extends FriendUser {
    bio?: string | null;
}

// ============================================================
// Enums
// ============================================================
export enum Friend_Request_Status {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED',
}

export enum UpdateRequestFromReceiverEnum {
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED',
}

// ============================================================
// Friendship (GET /friendship)
// ============================================================
export interface Friendship {
    id: string;
    user_friend: FriendUser;
    be_friend_at: string;
}

// ============================================================
// Search user (GET /user/search/:user_name)
// ============================================================
export interface SearchUserResult {
    id: string;
    user_name: string;
    nickname: string;
    bio?: string | null;
    avatar_url: string | null;
    is_friend: boolean;
    permission: {
        add_friend: boolean;
        cancel_request_friend: boolean;
        accept_request_friend: boolean;
        unfriend: boolean;
    };
}

// ============================================================
// Outgoing request (GET /friend_request/outgoing_requests)
// ============================================================
export interface OutgoingFriendRequest {
    id: string;
    receiver: FriendUserWithBio;
    status: Friend_Request_Status;
    created_at: string;
}

// ============================================================
// Ingoing request (GET /friend_request/ingoing_requests)
// ============================================================
export interface IngoingFriendRequest {
    id: string;
    sender: FriendUserWithBio;
    status: Friend_Request_Status;
    created_at: string;
}

// ============================================================
// Mutation vars
// ============================================================
export interface AddFriendVars {
    receiver_id: string;
}

export interface CancelFriendRequestVars {
    request_id: string;
}

export interface UpdateFriendRequestVars {
    id: string;
    body: { status: UpdateRequestFromReceiverEnum };
}

export interface UnfriendVars {
    friend_id: string;
}