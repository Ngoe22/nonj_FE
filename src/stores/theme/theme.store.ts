import { create } from 'zustand';
type Theme = 'dark' | 'light';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',

    initTheme: () => {
        if (typeof window === 'undefined') return;
        const theme: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        set({ theme });
    },

    toggleTheme: () => {
        const nextTheme: Theme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });

        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', nextTheme);
    },
}));