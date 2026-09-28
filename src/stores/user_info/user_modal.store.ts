// import { create } from 'zustand';
// import type { BasicUser, UserWithBio } from '@/types/user_info/user_info.type';
//
//
// interface UserModalState {
//     user: BasicUser | null;
//     openModal: (user: BasicUser ) => void;
//     closeModal: () => void;
// }
//
// export const useUserModalStore = create<UserModalState>((set) => ({
//     user: null,
//     openModal: (user) => set({ user }),
//     closeModal: () => set({ user: null }),
// }));