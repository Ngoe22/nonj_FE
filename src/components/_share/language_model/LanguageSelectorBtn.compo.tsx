'use client';

import { Languages } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {LanguageCode, useLanguageStore} from "@/stores/language/language.store";



export function LanguageButton() {
    const pathname = usePathname();
    const open = useLanguageStore((state) => state.open);
    const currentLanguage =
        pathname.split('/')[1] as LanguageCode;

    return (
        <button
            type="button"
            onClick={() => open(currentLanguage)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-hover hover:text-foreground"
            aria-label="Change language"
        >
            <Languages size={18} />
        </button>
    );
}



export function useOpenLanguageSelector() {
    const pathname = usePathname();
    const open = useLanguageStore((state) => state.open);

    return () => {
        const currentLanguage =
            pathname.split('/')[1] as LanguageCode;

        open(currentLanguage);
    };
}
