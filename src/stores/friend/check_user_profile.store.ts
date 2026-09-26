import { create } from 'zustand';
import type { FriendUserWithBio } from '@/types/friend/friend.type';

interface CurrentFriendState {
    user: FriendUserWithBio | null;
    open: boolean;
    openModal: (user: FriendUserWithBio) => void;
    closeModal: () => void;
}

export const useCurrentFriendStore = create<CurrentFriendState>((set) => ({
    user: null,
    open: false,
    openModal: (user) => set({ user, open: true }),
    closeModal: () => set({ open: false }),
}));