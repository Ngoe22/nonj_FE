'use client';

import { useTranslations } from 'next-intl';

import type { DraftInput } from '@/components/post/exam/useExamSession.hook';

interface Props {
    value: DraftInput;
    onChange: (next: DraftInput) => void;
    disabled?: boolean;
}

export function InputAnswer({ value, onChange, disabled }: Props) {
    const txt = useTranslations('Post');

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{txt('input_hint')}</p>
            <input
                type="text"
                value={value.answer}
                disabled={disabled}
                onChange={(e) =>
                    onChange({ type: value.type, answer: e.target.value })
                }
                placeholder={txt('input_placeholder')}
                className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground disabled:opacity-60"
            />
        </div>
    );
}
