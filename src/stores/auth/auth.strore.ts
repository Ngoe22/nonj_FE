import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    user: { id: string; user_name: string; role: string } | null;
    setAuth: (token: string, user: AuthState['user']) => void;
    setAccessToken: (token: string) => void;
    setUser: (user: AuthState['user']) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setAuth: (accessToken, user) => set({ accessToken, user }),
            setAccessToken: (accessToken ) => set({ accessToken }),
            setUser: (user) => set({ user }),
            logout: () => set({ accessToken: null, user: null }),
        }),
        { name: 'auth-storage' },
    ),
);