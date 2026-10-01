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
 * - Điểm từng phần: chỉ trong khoảng 0..điểm tối đa của CHÍNH phần đó
 * - Nhận xét từng phần + nhận xét chung
 * - Tổng = điểm trắc nghiệm (BE chấm tự động) + điểm tự luận (chấm tay)
 *
 * Đáp án mẫu / ý chính CHỈ ĐỂ ĐỌC ở đây — nó thuộc về đề, do người ra đề đặt
 * lúc soạn. Sửa nó khi chấm sẽ làm lệch đáp án của cả lớp.
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
    const [note, setNote] = useState('');

    // React khuyến nghị: điều chỉnh state khi prop đổi NGAY TRONG RENDER
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setDrafts(buildDrafts(post, answer));
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

    /**
     * `type="number"` KHÔNG đủ: trình duyệt vẫn cho gõ `e`, `E`, `+`, `-`
     * (và tiếng Việt có thể gõ cả chữ). Chỉ giữ chữ số và tối đa một dấu chấm.
     */
    const cleanNumeric = (raw: string) =>
        raw
            .replace(/[^\d.]/g, '')
            .replace(/^(\d*\.\d*).*$/, '$1');

    /** Kẹp về 0..trần của phần — làm lúc rời ô để không cản lúc đang gõ */
    const clampPoint = (index: number, max: number) => {
        const raw = drafts[index]?.point ?? '';
        if (raw.trim() === '') {
            setDraft(index, { point: '0' });
            return;
        }
        const value = Number(raw);
        const safe = Number.isFinite(value)
            ? Math.min(Math.max(value, 0), max)
            : 0;
        setDraft(index, { point: String(safe) });
    };

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
        const sections: GradeSectionVars[] = essaySections.map(
            ({ section, index }) => {
                const max = Number(section.point ?? 0);
                const raw = Number(drafts[index]?.point ?? 0);
                const point = Number.isFinite(raw)
                    ? Math.min(Math.max(raw, 0), max)
                    : 0;

                return {
                    index,
                    point,
                    // KHÔNG gửi `sample_answer`: BE chỉ ghi đè khi field này
                    // được gửi, nên bỏ đi là đáp án mẫu của đề được giữ nguyên.
                    comment: drafts[index]?.comment ?? '',
                };
            },
        );

        await onSubmit({
            answer_id: answer?.id ?? '',
            sections,
            review_note: note,
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92dvh] w-[95vw] overflow-y-auto sm:max-w-4xl">
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
                                {previewTotal}/{maxPoint}
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
                                                type="text"
                                                inputMode="decimal"
                                                value={draft.point}
                                                onChange={(e) =>
                                                    setDraft(index, {
                                                        point: cleanNumeric(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                onBlur={() =>
                                                    clampPoint(
                                                        index,
                                                        Number(
                                                            section.point ?? 0,
                                                        ),
                                                    )
                                                }
                                                className={fieldClass}
                                            />
                                            <p className="mt-1 text-[11px] text-muted-foreground">
                                                {txt('point_range_hint', {
                                                    max: section.point,
                                                })}
                                            </p>
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
                                        <p className="whitespace-pre-wrap rounded-xl border border-dashed border-border bg-surface p-3 text-sm">
                                            {draft.sample_answer || '—'}
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            {txt('model_answer_readonly')}
                                        </p>
                                    </div>
                                </section>
                            );
                        })}

                        <div className="border-t border-dashed border-border pt-4">
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
