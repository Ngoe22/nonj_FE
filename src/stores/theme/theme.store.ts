import { create } from 'zustand';

interface ThemeState {
    darkMode: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    darkMode: false,

    // Khởi tạo theme từ localStorage hoặc hệ thống (chạy phía client)
    initTheme: () => {
        if (typeof window === 'undefined') return;

        const savedTheme = localStorage.getItem('theme');
        const isDark =
            savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

        set({ darkMode: isDark });
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    // Đổi theme và đồng bộ vào DOM + localStorage
    toggleTheme: () => {
        const nextMode = !get().darkMode;
        set({ darkMode: nextMode });

        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    },
}));