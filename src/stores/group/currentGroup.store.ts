import { create } from 'zustand';
import {Group} from "@/types/group/group.type";

interface CurrentGroupState {
    currentGroup: Group | null;
    setCurrentGroup: (group: Group) => void;
    clearCurrentGroup: () => void;
}

export const useCurrentGroupStore = create<CurrentGroupState>((set) => ({
    currentGroup: null,
    setCurrentGroup: (group) => set({ currentGroup: group }),
    clearCurrentGroup: () => set({ currentGroup: null }),
}));