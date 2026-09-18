'use client';

import {useTranslations} from "next-intl";

type RegisterMethod = 'manual' | 'google';

interface AuthMethodSelectorProps {
    method: RegisterMethod;
    onChange: (method: RegisterMethod) => void;
}

export default function RegisterMethodSelector({method, onChange,}: AuthMethodSelectorProps) {

    const txt = useTranslations('Auth')

    return (
        <div>
            {/*<p className="mb-3 text-sm font-medium text-foreground">*/}
            {/*    {txt("register_method_text")}*/}
            {/*</p>*/}

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onChange('manual')}
                    className={`
                        rounded-xl border px-4 py-3 text-sm font-medium
                        transition
                        ${
                        method === 'manual'
                            ? 'border-border-strong bg-surface-hover text-foreground'
                            : 'border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                    }
                    `}
                >
                    {txt('manual_option')}
                </button>

                <button
                    type="button"
                    onClick={() => onChange('google')}
                    className={`
                        rounded-xl border px-4 py-3 text-sm font-medium
                        transition
                        ${
                        method === 'google'
                            ? 'border-border-strong bg-surface-hover text-foreground'
                            : 'border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                    }
                    `}
                >
                    {txt('google_option')}
                </button>
            </div>
        </div>
    );
}