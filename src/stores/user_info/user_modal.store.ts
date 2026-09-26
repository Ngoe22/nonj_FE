import { create } from 'zustand';
import type { BasicUser, UserWithBio } from '@/types/user_info/user_info.type';

type ModalUser = BasicUser & { bio?: string | null };

interface UserModalState {
    user: ModalUser | null;
    openModal: (user: ModalUser) => void;
    closeModal: () => void;
}

export const useUserModalStore = create<UserModalState>((set) => ({
    user: null,
    openModal: (user) => set({ user }),
    closeModal: () => set({ user: null }),
}));