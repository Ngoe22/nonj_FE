export enum Group_Member_Role {
    FOUNDER = 'founder',
    ADMIN = 'admin',
    MEMBER = 'member',
}

export enum GroupMemberUpdateAction {
    PROMOTE = 'PROMOTE',
    DEMOTE = 'DEMOTE',
    REMOVE_ADMIN = 'REMOVE_ADMIN',
}

export interface GroupMemberUser {
    id: string;
    user_name: string;
    nickname: string;
    avatar_url: string | null;
}

export interface GroupMember {
    id: string;
    user: GroupMemberUser;
    group: { id: string };
    role: Group_Member_Role;
    updated_at: string;
    _permission: {
        kick_admin: boolean;
        kick_mem: boolean;
        promote_mem: boolean;
        demote_admin: boolean;
    };
}

export interface UpdateGroupMemberVars {
    group_id: string;
    target_id: string;
    action: GroupMemberUpdateAction;
}

export interface KickGroupMemberVars {
    group_id: string;
    user_id: string;
    /** id của GroupMember record — dùng cho optimistic remove */
    member_id: string;
}