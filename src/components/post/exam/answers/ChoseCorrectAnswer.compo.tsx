'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ChoseCorrectContentItem } from '@/types/question_preparation/question_preparation.type';
import type { DraftChoseCorrect } from '@/components/post/exam/useExamSession.hook';

interface Props {
    item: ChoseCorrectContentItem;
    value: DraftChoseCorrect;
    onChange: (next: DraftChoseCorrect) => void;
    disabled?: boolean;
}

export function ChoseCorrectAnswer({ item, value, onChange, disabled }: Props) {
    const txt = useTranslations('Post');

    const toggle = (index: number) => {
        if (disabled) return;
        const selected = value.options.includes(index);
        onChange({
            type: value.type,
            options: selected
                ? value.options.filter((i) => i !== index)
                : [...value.options, index],
        });
    };

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                {txt('choose_one_or_more')}
            </p>

            {item.options.map((option, index) => {
                const selected = value.options.includes(index);
                return (
                    <button
                        key={index}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggle(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                            selected
                                ? 'border-foreground bg-surface-hover'
                                : 'border-border hover:bg-surface-hover'
                        } disabled:opacity-60`}
                    >
                        <span className="text-xs font-medium text-muted-foreground">
                            {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {selected && <Check size={15} />}
                    </button>
                );
            })}
        </div>
    );
}
