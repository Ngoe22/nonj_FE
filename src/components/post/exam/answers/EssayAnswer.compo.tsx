'use client';

import { useTranslations } from 'next-intl';

interface Props {
    value: string;
    onChange: (next: string) => void;
    disabled?: boolean;
}

export function EssayAnswer({ value, onChange, disabled }: Props) {
    const txt = useTranslations('Post');

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{txt('essay_hint')}</p>
            <textarea
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                placeholder={txt('essay_placeholder')}
                className="min-h-56 w-full resize-y rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground disabled:opacity-60"
            />
        </div>
    );
}
