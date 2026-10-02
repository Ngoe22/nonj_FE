'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';
import { ExamPageView } from '@/components/post/exam/ExamPageView.compo';
import {
    formatDuration,
    useExamSession,
    type DraftSection,
} from '@/components/post/exam/useExamSession.hook';

import type { Post, SubmissionSection } from '@/types/post/post.type';

interface Props {
    open: boolean;
    post: Post;
    /** nạp đáp án cũ khi LÀM LẠI */
    initialAnswers?: Record<number, DraftSection>;
    onClose: () => void;
    onSubmit: (payload: SubmissionSection[]) => void | Promise<void>;
    isSubmitting?: boolean;
}

const SWIPE_THRESHOLD = 60;

export function ExamOverlay({
    open,
    post,
    initialAnswers,
    onClose,
    onSubmit,
    isSubmitting,
}: Props) {
    const txt = useTranslations('Post');

    const {
        currentPage,
        pageIndex,
        currentSectionIndex,
        isFirst,
        isLast,
        answers,
        setItemAnswer,
        setEssayAnswer,
        goNext,
        goPrev,
        submit,
        answeredCount,
        totalPages,
        currentSectionRemaining,
        blankEssaySections,
    } = useExamSession({
        content: post.content ?? [],
        onSubmit,
        initialAnswers,
    });

    const [submitOpen, setSubmitOpen] = useState(false);
    const [exitOpen, setExitOpen] = useState(false);

    // ---------------- vuốt ngang ----------------
    const touchStartX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;

        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        // Vuốt sang PHẢI (delta > 0) = lùi về câu trước, sang TRÁI = tới câu
        // sau (chuẩn carousel LTR). Trước đây ngược chiều.
        if (delta > 0) goPrev();
        else goNext();
    };

    // ---------------- submit ----------------
    const confirmSubmit = async () => {
        setSubmitOpen(false);
        await submit();
    };

    if (!open) return null;

    const timeIsLow =
        currentSectionRemaining !== null && currentSectionRemaining <= 60;

    const sectionCount = post.content?.length ?? 0;
    const currentSectionNumber = currentSectionIndex + 1;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            {/* ================= Header ================= */}
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
                <button
                    type="button"
                    onClick={() => setExitOpen(true)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    aria-label={txt('exit')}
                >
                    <X size={18} />
                </button>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                        {post.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {txt('question_of', {
                            current: pageIndex + 1,
                            total: totalPages,
                        })}
                        {sectionCount > 1 &&
                            ` · ${txt('section_of', {
                                current: currentSectionNumber,
                                total: sectionCount,
                            })}`}
                    </p>
                </div>

                <div
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium tabular-nums ${
                        timeIsLow
                            ? 'border-red-500/60 text-red-600'
                            : 'border-border text-muted-foreground'
                    }`}
                >
                    <Clock size={13} />
                    {currentSectionRemaining === null
                        ? txt('no_time_limit')
                        : formatDuration(currentSectionRemaining)}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={isSubmitting}
                    onClick={() => setSubmitOpen(true)}
                >
                    <Send size={13} />
                    {txt('submit')}
                </Button>
            </header>

            {/* Còn tự luận để trống -> không cho nộp */}
            {blankEssaySections.length > 0 && (
                <div className="flex items-center gap-2 border-b border-status-warning bg-status-warning-bg px-4 py-2 text-xs font-medium text-status-warning">
                    <AlertTriangle size={14} />
                    {txt('essay_required', {
                        count: blankEssaySections.length,
                    })}
                </div>
            )}

            {/* ================= Thanh tiến độ ================= */}
            <div className="h-1 w-full bg-surface-hover">
                <div
                    className="h-full bg-foreground transition-all"
                    style={{
                        width: `${totalPages ? ((pageIndex + 1) / totalPages) * 100 : 0}%`,
                    }}
                />
            </div>

            {/* ================= Nội dung trang ================= */}
            <main
                className="flex-1 overflow-y-auto px-4 py-5"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="mx-auto w-full max-w-3xl">
                    {currentPage ? (
                        <ExamPageView
                            page={currentPage}
                            answers={answers}
                            setItemAnswer={setItemAnswer}
                            setEssayAnswer={setEssayAnswer}
                        />
                    ) : (
                        <p className="py-16 text-center text-sm text-muted-foreground">
                            {txt('no_questions')}
                        </p>
                    )}
                </div>
            </main>

            {/* ================= Điều hướng ================= */}
            <footer className="flex items-center gap-3 border-t border-border px-4 py-3">
                <Button
                    type="button"
                    variant="outline"
                    className="gap-1"
                    disabled={isFirst}
                    onClick={goPrev}
                >
                    <ChevronLeft size={16} />
                    {txt('prev')}
                </Button>

                <span className="mx-auto text-xs tabular-nums text-muted-foreground">
                    {answeredCount}/{totalPages} {txt('answered')}
                </span>

                {!isLast ? (
                    <Button
                        type="button"
                        className="gap-1"
                        onClick={goNext}
                    >
                        {txt('next')}
                        <ChevronRight size={16} />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        className="gap-1.5"
                        disabled={isSubmitting}
                        onClick={() => setSubmitOpen(true)}
                    >
                        <Send size={14} />
                        {isSubmitting ? txt('submitting') : txt('submit')}
                    </Button>
                )}
            </footer>

            {/* ================= Modals ================= */}
            <ConfirmModal
                open={submitOpen}
                title={txt('confirm_submit_title')}
                description={txt('confirm_submit_desc', {
                    answered: answeredCount,
                    total: totalPages,
                })}
                onClose={() => setSubmitOpen(false)}
                onConfirm={confirmSubmit}
            />

            <ConfirmModal
                open={exitOpen}
                title={txt('confirm_exit_title')}
                description={txt('confirm_exit_desc')}
                onClose={() => setExitOpen(false)}
                onConfirm={() => {
                    setExitOpen(false);
                    onClose();
                }}
            />
        </div>
    );
}
