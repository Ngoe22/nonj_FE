import { create } from 'zustand';

export const languages = [
    {
        code: 'vi',
        name: 'Tiếng Việt',
        nativeName: 'Tiếng Việt',
    },
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
    },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

interface LanguageState {
    isOpen: boolean;
    selectedLanguage: LanguageCode | null;

    open: (currentLanguage: LanguageCode) => void;
    close: () => void;
    selectLanguage: (language: LanguageCode) => void;
    reset: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    isOpen: false,
    selectedLanguage: null,

    open: (currentLanguage) =>
        set({
            isOpen: true,
            selectedLanguage: currentLanguage,
        }),

    close: () =>
        set({
            isOpen: false,
            selectedLanguage: null,
        }),

    selectLanguage: (language) =>
        set({
            selectedLanguage: language,
        }),

    reset: () =>
        set({
            isOpen: false,
            selectedLanguage: null,
        }),
}));