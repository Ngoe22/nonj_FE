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
        kick_mem: true,
        promote_mem: false,
        demote_mem: true,
    },
};