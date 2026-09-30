'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { QuestionContentView } from '@/components/question_preparation/preparation/detail/SectionView.compo';

import {
    Question_Item_Type,
    Question_Section_Type,
} from '@/enum/question_preparation/question_preparation.enum';
import { Post_Answer_Status } from '@/enum/post_answer/post_answer.enum';
import type { QuestionContentItem } from '@/types/question_preparation/question_preparation.type';
import type { Post } from '@/types/post/post.type';
import type { PostAnswer } from '@/types/post_answer/post_answer.type';
import type { GradedItemResult } from '@/types/grading/grading.type';

interface Props {
    open: boolean;
    post: Post;
    answer: PostAnswer;
    onClose: () => void;
}

/** Format một giá trị đáp án (đúng hoặc đã nộp) thành chuỗi dễ đọc */
function renderItemValue(item: QuestionContentItem, raw: unknown): string {
    switch (item.type) {
        case Question_Item_Type.CHOSE_CORRECT: {
            const indices = Array.isArray(raw) ? raw.map(Number) : [];
            if (indices.length === 0) return '—';
            return indices
                .map(
                    (index) =>
                        `${String.fromCharCode(65 + index)}. ${item.options[index] ?? ''}`,
                )
                .join('\n');
        }
        case Question_Item_Type.ARRANGE:
            return Array.isArray(raw) && raw.length > 0
                ? raw.join(' → ')
                : '—';
        case Question_Item_Type.PAIRING:
            return Array.isArray(raw) && raw.length > 0
                ? raw
                      .map(
                          (pair: { key?: unknown; value?: unknown }) =>
                              `${pair?.key ?? ''} → ${pair?.value ?? ''}`,
                      )
                      .join('\n')
                : '—';
        case Question_Item_Type.INPUT:
            return Array.isArray(raw) && raw.length > 0
                ? raw.join(' / ')
                : '—';
        default:
            return '—';
    }
}

function ValueBlock({
    label,
    value,
    tone = 'neutral',
}: {
    label: string;
    value: string;
    tone?: 'neutral' | 'correct' | 'wrong';
}) {
    const toneClass =
        tone === 'correct'
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : tone === 'wrong'
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-border bg-surface';

    return (
        <div className={`rounded-xl border px-3 py-2 ${toneClass}`}>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="whitespace-pre-wrap text-sm">{value}</p>
        </div>
    );
}

export function AnswerDetailOverlay({ open, post, answer, onClose }: Props) {
    const txt = useTranslations('Post');

    if (!open) return null;

    const grade = answer.review_content?.auto;
    const sections = post.content ?? [];
    const manual = answer.review_content?.manual as
        | { note?: string; point?: number }
        | undefined;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
            {/* ================= Header ================= */}
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    aria-label={txt('close')}
                >
                    <X size={18} />
                </button>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                        {txt('answer_detail')}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                        {post.title}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {answer.status === Post_Answer_Status.PENDING && (
                        <Badge variant="secondary">
                            {txt('pending_grade')}
                        </Badge>
                    )}
                    {answer.point !== null && answer.max_point !== null && (
                        <Badge className="tabular-nums">
                            {answer.point}/{answer.max_point}
                        </Badge>
                    )}
                </div>
            </header>

            <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5">
                {!grade && (
                    <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        {txt('no_grade_detail')}
                    </p>
                )}

                {sections.map((section, sectionIndex) => {
                    const graded = grade?.sections?.[sectionIndex];

                    return (
                        <section
                            key={sectionIndex}
                            className="rounded-2xl border-2 border-border p-4"
                        >
                            {/* Đầu mục section */}
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium">
                                    {section.type ===
                                    Question_Section_Type.MULTIPLE_CHOICE
                                        ? txt('multiple_choice')
                                        : txt('essay')}
                                </span>
                                {section.title && (
                                    <span className="text-sm font-semibold">
                                        {section.title}
                                    </span>
                                )}
                                {graded && (
                                    <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                                        {graded.point}/{graded.max_point}
                                    </span>
                                )}
                            </div>

                            {(section.content?.text ||
                                section.content?.img_url ||
                                section.content?.mp3_url) && (
                                <div className="mb-3 rounded-xl border border-border bg-surface p-3">
                                    <QuestionContentView
                                        content={section.content}
                                    />
                                </div>
                            )}

                            {/* ---------- TRẮC NGHIỆM ---------- */}
                            {section.type ===
                                Question_Section_Type.MULTIPLE_CHOICE &&
                                section.items.map((item, itemIndex) => {
                                    const result: GradedItemResult | undefined =
                                        graded?.items?.[itemIndex];

                                    return (
                                        <div
                                            key={itemIndex}
                                            className="mb-3 rounded-xl border border-border p-3 last:mb-0"
                                        >
                                            <div className="mb-2 flex items-start gap-2">
                                                <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-semibold">
                                                    {itemIndex + 1}
                                                </span>
                                                <p className="flex-1 text-sm font-medium">
                                                    {item.question || '—'}
                                                </p>

                                                {result?.is_correct ===
                                                    true && (
                                                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                                                        <Check size={13} />
                                                        {txt('correct')}
                                                    </span>
                                                )}
                                                {result?.is_correct ===
                                                    false && (
                                                    <span className="flex items-center gap-1 text-xs text-red-600">
                                                        <X size={13} />
                                                        {txt('wrong')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <ValueBlock
                                                    label={txt('your_answer')}
                                                    tone={
                                                        result?.is_correct ===
                                                        true
                                                            ? 'correct'
                                                            : result?.is_correct ===
                                                                false
                                                              ? 'wrong'
                                                              : 'neutral'
                                                    }
                                                    value={renderItemValue(
                                                        item,
                                                        result?.received,
                                                    )}
                                                />
                                                <ValueBlock
                                                    label={txt(
                                                        'correct_answer_label',
                                                    )}
                                                    value={renderItemValue(
                                                        item,
                                                        result?.expected,
                                                    )}
                                                />
                                            </div>

                                            <p className="mt-2 text-[11px] text-muted-foreground">
                                                {txt('point_label')}:{' '}
                                                {result?.earned_point ?? 0}/
                                                {result?.max_point ??
                                                    item.point}
                                            </p>
                                        </div>
                                    );
                                })}

                            {/* ---------- TỰ LUẬN ---------- */}
                            {section.type === Question_Section_Type.ESSAY && (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <ValueBlock
                                        label={txt('your_answer')}
                                        value={
                                            String(
                                                graded?.answer_text ?? '',
                                            ) || '—'
                                        }
                                    />
                                    <ValueBlock
                                        label={txt('sample_answer_label')}
                                        value={
                                            String(
                                                graded?.sample_answer ?? '',
                                            ) || '—'
                                        }
                                    />
                                </div>
                            )}
                        </section>
                    );
                })}

                {manual?.note && (
                    <div className="rounded-2xl border border-border bg-surface p-4">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {txt('review_note')}
                        </p>
                        <p className="text-sm">{manual.note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
