'use client';

import { useTranslations } from 'next-intl';

import type { PairingContentItem } from '@/types/question_preparation/question_preparation.type';
import type { DraftPairing } from '@/components/post/exam/useExamSession.hook';

interface Props {
    item: PairingContentItem;
    value: DraftPairing;
    onChange: (next: DraftPairing) => void;
    disabled?: boolean;
}

export function PairingAnswer({ item, value, onChange, disabled }: Props) {
    const txt = useTranslations('Post');

    const valueOf = (key: string) =>
        value.pairs.find((pair) => pair.key === key)?.value ?? '';

    const setPair = (key: string, nextValue: string) => {
        if (disabled) return;
        const others = value.pairs.filter((pair) => pair.key !== key);
        const next = nextValue
            ? [...others, { key, value: nextValue }]
            : others;
        // giữ thứ tự theo cột A cho dễ đọc
        next.sort(
            (a, b) => item.keys.indexOf(a.key) - item.keys.indexOf(b.key),
        );
        onChange({ type: value.type, pairs: next });
    };

    // mỗi giá trị chỉ dùng được 1 lần -> buộc ghép 1-1
    const usedValues = new Set(value.pairs.map((pair) => pair.value));

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{txt('pairing_hint')}</p>

            <div className="space-y-2">
                {item.keys.map((key) => {
                    const chosen = valueOf(key);
                    return (
                        <div key={key} className="flex items-center gap-2">
                            <span className="min-w-24 flex-1 rounded-lg border border-border px-3 py-2 text-sm">
                                {key}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <select
                                value={chosen}
                                disabled={disabled}
                                onChange={(e) => setPair(key, e.target.value)}
                                className="flex-1 rounded-lg border-2 border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground disabled:opacity-60"
                            >
                                <option value="">{txt('pairing_choose')}</option>
                                {item.values.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                        disabled={
                                            usedValues.has(option) &&
                                            option !== chosen
                                        }
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
