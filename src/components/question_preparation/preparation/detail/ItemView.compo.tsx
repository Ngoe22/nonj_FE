'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Question_Item_Type } from '@/enum/question_preparation/question_preparation.enum';
import {
    isArrangeItem,
    isChoseCorrectItem,
    isInputItem,
    isPairingItem,
    type QuestionAnswerItem,
    type QuestionContentItem,
} from '@/types/question_preparation/question_preparation.type';

interface Props {
    item: QuestionContentItem;
    answer?: QuestionAnswerItem;
    index: number;
    /**
     * false = KHÔNG hiện đáp án (học viên chưa làm bài, hoặc đang xem trước đề).
     * Khi đó cũng không hiện placeholder "Chưa có đáp án".
     */
    showAnswers?: boolean;
}

function Chip({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'correct' | 'muted';
}) {
    const toneClass =
        tone === 'correct'
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            : tone === 'muted'
              ? 'border-border bg-surface text-muted-foreground'
              : 'border-border bg-surface-hover text-foreground';

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs ${toneClass}`}
        >
            {children}
        </span>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {children}
        </p>
    );
}

function NoAnswer({ show }: { show: boolean }) {
    const txt = useTranslations('Question_preparation');
    if (!show) return null;
    return (
        <p className="text-xs text-muted-foreground">{txt('no_answer')}</p>
    );
}

export function ItemView({
    item,
    answer,
    index,
    showAnswers = true,
}: Props) {
    const txt = useTranslations('Question_preparation');
    const builderTxt = useTranslations('Question_builder');

    const typeLabel = {
        [Question_Item_Type.CHOSE_CORRECT]: builderTxt(
            'item_type_chose_correct',
        ),
        [Question_Item_Type.ARRANGE]: builderTxt('item_type_arrange'),
        [Question_Item_Type.PAIRING]: builderTxt('item_type_pairing'),
        [Question_Item_Type.INPUT]: builderTxt('item_type_input'),
    }[item.type];

    return (
        <div className="rounded-xl border border-border bg-surface p-2.5 sm:p-3">
            {/* Đầu mục */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-semibold">
                        {index + 1}
                    </span>
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                        {typeLabel}
                    </span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                    {txt('point_label')}: {item.point}
                </span>
            </div>

            {item.question && (
                <p className="mt-2 break-words text-sm font-medium text-foreground">
                    {item.question}
                </p>
            )}

            {/* ============ CHOSE_CORRECT ============ */}
            {isChoseCorrectItem(item) && (
                <div className="mt-3 space-y-1.5">
                    {item.options.map((option, optionIndex) => {
                        const isCorrect =
                            showAnswers &&
                            answer?.type ===
                                Question_Item_Type.CHOSE_CORRECT &&
                            (answer.correct_options ?? []).includes(optionIndex);

                        return (
                            <div
                                key={optionIndex}
                                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${
                                    isCorrect
                                        ? 'border-emerald-500/50 bg-emerald-500/10'
                                        : 'border-border'
                                }`}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="min-w-0 flex-1 break-words">{option}</span>
                                {isCorrect && (
                                    <Check
                                        size={14}
                                        className="text-emerald-600"
                                    />
                                )}
                            </div>
                        );
                    })}

                    <NoAnswer
                        show={
                            showAnswers &&
                            answer?.type !==
                                Question_Item_Type.CHOSE_CORRECT
                        }
                    />
                </div>
            )}

            {/* ============ ARRANGE ============ */}
            {isArrangeItem(item) && (
                <div className="mt-3 space-y-2">
                    <div>
                        <Label>{txt('arrange_display_label')}</Label>
                        <div className="flex flex-wrap gap-1.5">
                            {item.shuffled.map((word, wordIndex) => (
                                <Chip key={wordIndex} tone="muted">
                                    {word}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    {showAnswers && (
                        <div>
                            <Label>{txt('arrange_correct_label')}</Label>
                            {answer?.type === Question_Item_Type.ARRANGE &&
                            (answer.correct ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {answer.correct.map((word, wordIndex) => (
                                        <Chip key={wordIndex} tone="correct">
                                            <span className="text-muted-foreground">
                                                {wordIndex + 1}.
                                            </span>
                                            {word}
                                        </Chip>
                                    ))}
                                </div>
                            ) : (
                                <NoAnswer show />
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ============ PAIRING ============ */}
            {isPairingItem(item) && (
                <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>{builderTxt('pair_left')}</Label>
                            <div className="flex flex-wrap gap-1.5">
                                {item.keys.map((key, keyIndex) => (
                                    <Chip key={keyIndex}>{key}</Chip>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label>{builderTxt('pair_right')}</Label>
                            <div className="flex flex-wrap gap-1.5">
                                {item.values.map((value, valueIndex) => (
                                    <Chip key={valueIndex} tone="muted">
                                        {value}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>

                    {showAnswers && (
                        <div>
                            <Label>{txt('pairing_correct_label')}</Label>
                            {answer?.type === Question_Item_Type.PAIRING &&
                            (answer.pairs ?? []).length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {answer.pairs.map((pair, pairIndex) => (
                                        <Chip key={pairIndex} tone="correct">
                                            {pair.key}
                                            <span className="text-muted-foreground">
                                                →
                                            </span>
                                            {pair.value}
                                        </Chip>
                                    ))}
                                </div>
                            ) : (
                                <NoAnswer show />
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ============ INPUT ============ */}
            {isInputItem(item) && showAnswers && (
                <div className="mt-3">
                    <Label>{txt('input_accepted_label')}</Label>
                    {answer?.type === Question_Item_Type.INPUT &&
                    (answer.correct_answers ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {answer.correct_answers.map((value, valueIndex) => (
                                <Chip key={valueIndex} tone="correct">
                                    {value}
                                </Chip>
                            ))}
                        </div>
                    ) : (
                        <NoAnswer show />
                    )}
                </div>
            )}
        </div>
    );
}
