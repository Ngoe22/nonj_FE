export enum Group_Join_Mode {
    BY_REQUEST = 'BY_REQUEST',
    PUBLIC = 'PUBLIC',
}

export enum Group_View_Mode {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
}

export const testGroupData = {
    id: 'awyqiuwe1283913',
    founder: {
        id: '123akdasdjasd',
        user_name: 'mumu',
        nickname: 'momo',
    },
    slug: 'chicken',
    name: 'jolibe',
    description: 'pls dont',
    join_mode: Group_Join_Mode.BY_REQUEST,
    view_mode: Group_View_Mode.PRIVATE,
    permission: {
        view_setting: true,
        view_join_req : true,
        view_member : true ,
        edit_setting: true,
        able_to_leave : true,
        able_to_delete : true,
    },
};

export const testGroupCollectionData = {
    id: 'eqwe1231q12312l',
    title: 'Some group',
    desc: 'blabla',
    group: {
        id: 'eqwe1231q12312asdl',
    },
    _permission: {
        delete: true,
        add: true,
        edit: true,
    },
};

export const joinrequestTest = {
    id: 'l12309asldalsdjl',
    sender: {
        id: 'balbal',
        user_name: 'balbal',
        nickname: 'balbal',
        avatar_url: 'https://i.pravatar.cc/100?img=12',
    },
    status: 'pending',
    created_time: '2026-07-09',
    _permission: {
        approve: true,
        reject: true,
    },
};

export const member = {
    id: 'balbal',
    user: {
        id: 'balbal',
        user_name: 'balbal',
        nickname: 'balbal',
        avatar_url: 'https://i.pravatar.cc/100?img=12',
    },
    group: {
        id: '123asd',
    },
    role: 'admin',
    updated_at: '2026-07-09',
    _permission: {
        kick_admin: true,
        kick_mem: true,
        promote_mem: false,
        demote_admin: true,
    },
};

export const outgoingReq = {
    id: 'balbal',
    receiver: {
        id: 'balbal',
        user_name: 'balbal',
        nickname: 'balbal',
        avatar_url: 'https://i.pravatar.cc/100?img=12',
    },
    status: 'pending',
    created_at: 'send time 2026-07-09',
};

export const ingoingReq = {
    id: 'balbal',
    sender: {
        id: 'balbal',
        user_name: 'balbal',
        nickname: 'balbal',
        avatar_url: 'https://i.pravatar.cc/100?img=12',
    },
    status: 'pending',
    created_at: 'send time 2026-07-09',
};

export const friendList = {
    id: ['admin', 'me'],
    user_friend: {
        id: 'balbal',
        user_name: 'balbal',
        nickname: 'balbal',
        avatar_url: 'https://i.pravatar.cc/100?img=12',
    },
    updated_at: 'send time 2026-07-09',
};

export const searchUser = {
    id: 'balbal',
    user_name: 'balbal',
    nickname: 'balbal',
    avatar_url: 'https://i.pravatar.cc/100?img=12',
};



export interface SearchGroupData {
    id: string;
    founder: {
        id: string;
        user_name: string;
        nickname: string;
    };
    slug: string;
    name: string;
    description: string;
    join_mode: Group_Join_Mode;
    view_mode: Group_View_Mode;
    isjoined: boolean;
}

export const testSearchGroups: SearchGroupData[] = [
    {
        id: 'awyqiuwe1283913',
        founder: {
            id: '123akdasdjasd',
            user_name: 'mumu',
            nickname: 'momo',
        },
        slug: 'chicken',
        name: 'jolibe',
        description: 'pls dont',
        join_mode: Group_Join_Mode.BY_REQUEST,
        view_mode: Group_View_Mode.PRIVATE,
        isjoined: true,
    },

    {
        id: 'group_public_001',
        founder: {
            id: 'founder_public',
            user_name: 'john',
            nickname: 'John',
        },
        slug: 'frontend',
        name: 'Frontend Developer',
        description: 'A group for frontend developers.',
        join_mode: Group_Join_Mode.PUBLIC,
        view_mode: Group_View_Mode.PUBLIC,
        isjoined: false,
    },

    {
        id: 'group_request_001',
        founder: {
            id: 'founder_request',
            user_name: 'anna',
            nickname: 'Anna',
        },
        slug: 'nestjs',
        name: 'NestJS Community',
        description: 'NestJS developers community.',
        join_mode: Group_Join_Mode.BY_REQUEST,
        view_mode: Group_View_Mode.PUBLIC,
        isjoined: false,
    },

    {
        id: 'group_private_001',
        founder: {
            id: 'founder_private',
            user_name: 'alex',
            nickname: 'Alex',
        },
        slug: 'private-team',
        name: 'Private Team',
        description: 'Private group.',
        join_mode: Group_Join_Mode.BY_REQUEST,
        view_mode: Group_View_Mode.PRIVATE,
        isjoined: false,
    },
];

export interface OutgoingGroupRequest {
    id: string;
    group: SearchGroupData;
    status: 'pending';
    created_at: string;
}

export const outgoingGroupRequests: OutgoingGroupRequest[] = [
    {
        id: 'request_group_001',
        group: {
            id: 'group_request_001',
            founder: {
                id: 'founder_request',
                user_name: 'anna',
                nickname: 'Anna',
            },
            slug: 'nestjs',
            name: 'NestJS Community',
            description: 'NestJS developers community.',
            join_mode: Group_Join_Mode.BY_REQUEST,
            view_mode: Group_View_Mode.PUBLIC,
            isjoined: false,
        },
        status: 'pending',
        created_at: '2026-07-09',
    },
];


//=============================


export const MyExamPreparationCollection = {
    id: 'eqwe1231q12312l',
    title: 'Some exam preparation',
    desc: 'blabla ',
};

export const ExamPreparation = {
    id: 'eqwe1231q12312l',
    title: 'Some exam preparation',
    exercise_content: {},
    collection: {
        id: 'eqwe1231q12312asdl',
        name: 'eqwe1231q12312asdl',
    },
};

/*
 * Mock danh sách bài soạn trong collection.
 *
 * Hiện tại bạn chỉ cung cấp 1 ExamPreparation,
 * nên mình dùng luôn nó làm item đầu tiên.
 */
export const examPreparationList = [
    ExamPreparation,
];

/*
 * Mock danh sách collection.
 */
export const examPreparationCollections = [
    MyExamPreparationCollection,
];

//==============


export const myProfile = {
    id: 'balbal',
    email: 'balbal@example.com',
    user_name: 'balbal',
    nickname: 'balbal',
    bio: 'Hello, this is my profile.',
    avatar_url: 'https://i.pravatar.cc/100?img=12',
};