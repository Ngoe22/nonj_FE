'use client';

import { useTranslations } from 'next-intl';

import type { ArrangeContentItem } from '@/types/question_preparation/question_preparation.type';
import type { DraftArrange } from '@/components/post/exam/useExamSession.hook';

interface Props {
    item: ArrangeContentItem;
    value: DraftArrange;
    onChange: (next: DraftArrange) => void;
    disabled?: boolean;
}

export function ArrangeAnswer({ item, value, onChange, disabled }: Props) {
    const txt = useTranslations('Post');

    // pool = token chưa được xếp; giữ đúng số lượng kể cả khi trùng chữ
    const pool = [...item.shuffled];
    for (const chosen of value.order) {
        const at = pool.indexOf(chosen);
        if (at !== -1) pool.splice(at, 1);
    }

    const pick = (token: string, poolIndex: number) => {
        if (disabled) return;
        const next = [...value.order, token];
        void poolIndex;
        onChange({ type: value.type, order: next });
    };

    const unpick = (orderIndex: number) => {
        if (disabled) return;
        onChange({
            type: value.type,
            order: value.order.filter((_, i) => i !== orderIndex),
        });
    };

    return (
        <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{txt('arrange_hint')}</p>

            <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {txt('arrange_chosen')}
                </p>
                <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-border p-2">
                    {value.order.length === 0 && (
                        <span className="px-2 text-xs text-muted-foreground">
                            {txt('arrange_empty')}
                        </span>
                    )}
                    {value.order.map((token, index) => (
                        <button
                            key={`${token}-${index}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => unpick(index)}
                            className="rounded-lg border-2 border-foreground/40 bg-surface-hover px-3 py-1.5 text-sm disabled:opacity-60"
                        >
                            <span className="mr-1 text-xs text-muted-foreground">
                                {index + 1}.
                            </span>
                            {token}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {txt('arrange_pool')}
                </p>
                <div className="flex flex-wrap gap-2">
                    {pool.map((token, index) => (
                        <button
                            key={`${token}-${index}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => pick(token, index)}
                            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-hover disabled:opacity-60"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
