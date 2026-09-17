'use client';

import { X, Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {LanguageCode, languages, useLanguageStore} from "@/stores/language/language.store";
import {useTranslations} from "next-intl";



export default function LanguageSelector() {

    const txt =  useTranslations('LangueModel');


    const router = useRouter();
    const pathname = usePathname();

    const {
        isOpen,
        selectedLanguage,
        close,
        selectLanguage,
    } = useLanguageStore();

    if (!isOpen) {
        return null;
    }

    /*
     * Lấy locale hiện tại từ URL.
     *
     * /vi
     * /vi/group
     * /vi/profile
     *
     * => vi
     */
    const currentLanguage = pathname.split('/')[1] as LanguageCode;

    const handleConfirm = () => {
        if (!selectedLanguage) {
            return;
        }

        /*
         * Ví dụ:
         *
         * /vi
         * /vi/group
         * /vi/profile
         *
         * sẽ thành:
         *
         * /en
         * /en/group
         * /en/profile
         */

        const pathWithoutLocale =
            pathname.replace(`/${currentLanguage}`, '') || '';

        const newPath =
            `/${selectedLanguage}${pathWithoutLocale}`;

        close();

        router.push(newPath);
    };



    return (
        <>
            {/* BACKDROP */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                onClick={close}
            />

            {/* PANEL */}
            <div className="fixed inset-x-3 top-1/2 z-50 max-h-[85vh] -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:w-140 sm:-translate-x-1/2">
                <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">

                    {/* HEADER */}
                    <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                {txt('header')}
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {txt('header_desc')}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={close}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* LANGUAGE LIST */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-none [&::-webkit-scrollbar]:hidden sm:px-6">

                        <div className="columns-2 gap-3 sm:columns-3">
                            {languages.map((language ) => {
                                const isSelected =
                                    selectedLanguage === language.code;

                                const isCurrent =
                                    currentLanguage === language.code;

                                return (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() =>
                                            selectLanguage(language.code)
                                        }
                                        className={`
                                            mb-3
                                            flex
                                            w-full
                                            break-inside-avoid
                                            items-center
                                            justify-between
                                            rounded-2xl
                                            border
                                            px-4
                                            py-3
                                            text-left
                                            transition
                                            duration-200

                                            ${
                                            isSelected
                                                ? 'border-foreground bg-foreground text-background'
                                                : 'border-border bg-surface text-foreground hover:bg-surface-hover'
                                        }
                                        `}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">
                                                {language.nativeName}
                                            </div>

                                            <div
                                                className={`
                                                    mt-0.5 truncate text-xs
                                                    ${
                                                    isSelected
                                                        ? 'text-background/70'
                                                        : 'text-muted-foreground'
                                                }
                                                `}
                                            >
                                                {language.name}
                                            </div>
                                        </div>

                                        {/* CHECK */}
                                        {isSelected && (
                                            <Check
                                                size={17}
                                                className="ml-2 shrink-0"
                                            />
                                        )}

                                        {/* CURRENT */}
                                        {/*{!isSelected && isCurrent && (*/}
                                        {/*    <span className="ml-2 shrink-0 rounded-full bg-foreground px-2 py-1 text-[10px] font-medium text-background">*/}
                                        {/*        {txt('current')}*/}
                                        {/*    </span>*/}
                                        {/*)}*/}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selectedLanguage}
                            className="
                                w-full
                                rounded-2xl
                                bg-foreground
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-background
                                transition
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            {txt('confirm')}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}