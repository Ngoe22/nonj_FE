'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { Question_Section_Type } from '@/enum/question_preparation/question_preparation.enum';
import type { Post } from '@/types/post/post.type';
import type { EssayContentSection } from '@/types/question_preparation/question_preparation.type';
import type {
    GradeAnswerVars,
    GradeSectionVars,
    PostAnswer,
} from '@/types/post_answer/post_answer.type';
import type { ManualGradeInfo } from '@/types/post_answer/post_answer.type';

interface Props {
    open: boolean;
    post: Post;
    answer: PostAnswer | null;
    onClose: () => void;
    onSubmit: (vars: GradeAnswerVars) => void | Promise<void>;
    isSubmitting?: boolean;
}

interface Draft {
    point: string;
    sample_answer: string;
    comment: string;
}

const fieldClass =
    'mt-1 w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

/** Khởi tạo bản nháp từ bài làm + đề hiện tại */
function buildDrafts(post: Post, answer: PostAnswer | null): Record<number, Draft> {
    const drafts: Record<number, Draft> = {};
    const manual = answer?.review_content?.manual as
        | ManualGradeInfo
        | undefined;

    (post.content ?? []).forEach((section, index) => {
        if (section.type !== Question_Section_Type.ESSAY) return;

        const graded = manual?.sections?.find((item) => item.index === index);
        const autoSection = answer?.review_content?.auto?.sections?.find(
            (item) => item.index === index,
        );

        const modelAnswer =
            (post.correct_answer?.[index] as { sample_answer?: string })
                ?.sample_answer ??
            (autoSection?.sample_answer as string | undefined) ??
            '';

        drafts[index] = {
            point: String(graded?.point ?? autoSection?.point ?? 0),
            sample_answer: modelAnswer,
            comment: graded?.comment ?? '',
        };
    });

    return drafts;
}

/**
 * Giáo viên chấm phần TỰ LUẬN.
 *
 * - Điểm từng câu + nhận xét từng câu
 * - Ghi đè được ĐÁP ÁN MẪU (lưu vào post.correct_answer nên cả lớp thấy)
 * - Tổng = điểm trắc nghiệm (auto) + điểm tự luận (tay), hoặc ghi đè thẳng
 */
export default function GradeAnswerModal({
    open,
    post,
    answer,
    onClose,
    onSubmit,
    isSubmitting,
}: Props) {
    const txt = useTranslations('Post');

    const [drafts, setDrafts] = useState<Record<number, Draft>>({});
    const [totalOverride, setTotalOverride] = useState('');
    const [note, setNote] = useState('');

    // React khuyến nghị: điều chỉnh state khi prop đổi NGAY TRONG RENDER
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setDrafts(buildDrafts(post, answer));
            setTotalOverride('');
            setNote(
                (
                    answer?.review_content?.manual as ManualGradeInfo | undefined
                )?.note ?? '',
            );
        }
    }

    const essaySections = (post.content ?? [])
        .map((section, index) => ({ section, index }))
        .filter(
            (
                item,
            ): item is { section: EssayContentSection; index: number } =>
                item.section.type === Question_Section_Type.ESSAY,
        );

    const autoPoint = Number(answer?.review_content?.auto?.point ?? 0);
    const maxPoint = Number(
        answer?.max_point ?? answer?.review_content?.auto?.max_point ?? 0,
    );

    const manualPoint = essaySections.reduce((sum, { index }) => {
        const value = Number(drafts[index]?.point ?? 0);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const previewTotal = Number((autoPoint + manualPoint).toFixed(2));

    const setDraft = (index: number, patch: Partial<Draft>) => {
        setDrafts((prev) => {
            const current = prev[index] ?? {
                point: '0',
                sample_answer: '',
                comment: '',
            };
            return { ...prev, [index]: { ...current, ...patch } };
        });
    };

    const submit = async () => {
        const sections: GradeSectionVars[] = essaySections.map(({ index }) => ({
            index,
            point: Number(drafts[index]?.point ?? 0) || 0,
            sample_answer: drafts[index]?.sample_answer ?? '',
            comment: drafts[index]?.comment ?? '',
        }));

        await onSubmit({
            answer_id: answer?.id ?? '',
            sections,
            point:
                totalOverride.trim() === ''
                    ? undefined
                    : Number(totalOverride),
            review_note: note,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {txt('grade_title')} · {post.title}
                    </DialogTitle>
                </DialogHeader>

                {essaySections.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        {txt('no_essay_section')}
                    </p>
                ) : (
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3 text-sm">
                            <span className="text-muted-foreground">
                                {txt('auto_point')}:
                            </span>
                            <span className="font-semibold tabular-nums">
                                {autoPoint}
                            </span>

                            <span className="ml-auto text-muted-foreground">
                                {txt('total_point')}:
                            </span>
                            <span className="font-semibold tabular-nums">
                                {totalOverride.trim() === ''
                                    ? previewTotal
                                    : Number(totalOverride) || 0}
                                /{maxPoint}
                            </span>
                        </div>

                        {essaySections.map(({ section, index }) => {
                            const draft = drafts[index] ?? {
                                point: '0',
                                sample_answer: '',
                                comment: '',
                            };

                            const submitted = answer?.answer_content?.[index];
                            const studentText =
                                submitted?.type ===
                                Question_Section_Type.ESSAY
                                    ? submitted.text
                                    : '';

                            return (
                                <section
                                    key={index}
                                    className="space-y-3 rounded-2xl border-2 border-border p-4"
                                >
                                    <h3 className="text-sm font-semibold">
                                        {txt('essay_section')} #{index + 1}
                                        {section.title
                                            ? ` · ${section.title}`
                                            : ''}{' '}
                                        <span className="text-muted-foreground">
                                            ({section.point} {txt('point_label')})
                                        </span>
                                    </h3>

                                    {/* Bài làm của học sinh */}
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                            {txt('student_answer')}
                                        </label>
                                        <p className="whitespace-pre-wrap rounded-xl border border-border bg-surface p-3 text-sm">
                                            {studentText || '—'}
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                {txt('section_point')}
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={draft.point}
                                                onChange={(e) =>
                                                    setDraft(index, {
                                                        point: e.target.value,
                                                    })
                                                }
                                                className={fieldClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                {txt('section_comment')}
                                            </label>
                                            <input
                                                type="text"
                                                value={draft.comment}
                                                onChange={(e) =>
                                                    setDraft(index, {
                                                        comment:
                                                            e.target.value,
                                                    })
                                                }
                                                className={fieldClass}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                            {txt('model_answer')}
                                        </label>
                                        <textarea
                                            value={draft.sample_answer}
                                            onChange={(e) =>
                                                setDraft(index, {
                                                    sample_answer:
                                                        e.target.value,
                                                })
                                            }
                                            className={`${fieldClass} min-h-24 resize-y`}
                                        />
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            {txt('model_answer_hint')}
                                        </p>
                                    </div>
                                </section>
                            );
                        })}

                        <div className="grid gap-3 border-t border-dashed border-border pt-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('override_total')}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={totalOverride}
                                    onChange={(e) =>
                                        setTotalOverride(e.target.value)
                                    }
                                    placeholder={String(previewTotal)}
                                    className={fieldClass}
                                />
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    {txt('override_total_hint')}
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('review_note')}
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className={`${fieldClass} min-h-20 resize-y`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                {txt('cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? txt('saving')
                                    : txt('confirm')}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
