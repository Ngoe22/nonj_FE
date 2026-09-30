



const testGroupData  = {
  id: 'awyqiuwe1283913',
  founder: { id: '123akdasdjasd', user_name: 'mumu', nickname: 'momo' },
  slug: 'chicken',
  name: 'jolibe',
  description: 'pls dont ',
  join_mode: 'BY_REQUEST',
  view_mode: 'PRIVATE',

  permission: {
    view_setting : true ,
    edit_setting : true ,
  }

};

// export enum Group_Join_Mode {
//   BY_REQUEST = 'BY_REQUEST',
//   PUBLIC = 'PUBLIC',
// }
//
// export enum Group_View_Mode {
//   PRIVATE = 'PRIVATE',
//   PUBLIC = 'PUBLIC',
// }


const testGroupCollectionData  = {
  id: 'eqwe1231q12312l',
  title: 'Some group',
  desc :  'blabla ',
  group: { id: 'eqwe1231q12312asdl' }, // khong can hien thi vi group co roi

  permission : { // de lam nut action
    delete : true ,
    add : true ,
    edit : true ,
  }
};


const joinrequestTest = {
  id: 'l12309asldalsdjl',
  sender:  {
    id : 'balbal' ,
    user_name : 'balbal',
    nickname : 'balbal',
    avatar_url : 'balbal.link',
  },
  status: 'pending',
  created_time : '2026-7-9' ,

  permission : { // de lam nut action
    approve : true ,
    reject : true ,
  }
}


const member = {
  id: 'balbal',
  user: {
    id : 'balbal' ,
    user_name : 'balbal',
    nickname : 'balbal',
    avatar_url : 'balbal.link',
  },
  group: { id : '123asd' }, // khong hien thi
  role: 'admin | user',
  updated_at : "joined time linke 2026-7-9" ,

  permission : { // de lam nut action
    kick_mem : true ,
    promote_mem : true ,
    demote_mem : true ,
  }
}
//============================



const outgoingReq = {
  id: 'balbal',
  receiver: {
    id: 'balbal',
    user_name: 'balbal',
    nickname: 'balbal',
    avatar_url: 'balbal.link',
  },
  status: 'pending',
  created_at: "send time 2026-7-9"
}

const ingoingReq = {
  id: 'balbal',
  sender: {
    id: 'balbal',
    user_name: 'balbal',
    nickname: 'balbal',
    avatar_url: 'balbal.link',
  },
  status: 'pending',
  created_at: "send time 2026-7-9"
}

const friendList = {
  id: ['admin', 'me'],
  user_friend: {
    id: 'balbal',
    user_name: 'balbal',
    nickname: 'balbal',
    avatar_url: 'balbal.link',
  },
  updated_at: "send time 2026-7-9"
}

const MyExamPreparationCollection  = {
  id: 'eqwe1231q12312l',
  title: 'Some exam preparation',
  desc :  'blabla ',
};


const ExamPreparation = {
  id: 'eqwe1231q12312l',
  title: 'Some exam preparation',
  exercise_content : {},  // code sau
  collection : { id : 'eqwe1231q12312asdl'  , name: 'eqwe1231q12312asdl' },
}


