'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import {
    AlarmClock,
    ArrowLeft,
    Eye,
    FileText,
    Pencil,
    Play,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionView } from '@/components/question_preparation/preparation/detail/SectionView.compo';
import { ExamOverlay } from '@/components/post/exam/ExamOverlay.compo';
import { buildDraftFromSubmission } from '@/components/post/exam/useExamSession.hook';
import { AnswerDetailOverlay } from '@/components/post/answer/AnswerDetailOverlay.compo';
import { OthersAnswers } from '@/components/post/detail/OthersAnswers.compo';
import PostMetaModal from '@/components/post/modal/PostMetaModal.compo';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';

import {
    useDeletePost,
    useGetPost,
    useUpdatePost,
} from '@/hooks/post/post.hook';
import {
    useGetMyAnswer,
    useRetakeAnswer,
    useSubmitAnswer,
} from '@/hooks/post/post_answer.hook';
import { usePostParams } from '@/hooks/post/use_post_params.hook';

import { formatDeadline, toDateTimeLocal } from '@/lib/format/datetime';
import {
    toDeadlineIso,
    type PostMetaFormValues,
} from '@/schemas/post/post.schema';
import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';
import { Post_Answer_Status } from '@/enum/post_answer/post_answer.enum';
import { isPastDeadline, type SubmissionSection } from '@/types/post/post.type';

export default function PostDetail() {
    const txt = useTranslations('Post');
    const router = useRouter();
    const { groupId, collectionId, postId } = usePostParams();

    const { data: post, isLoading, isError } = useGetPost(
        groupId,
        collectionId,
        postId,
    );
    const { data: myAnswer } = useGetMyAnswer(groupId, collectionId, postId);

    const submitMutation = useSubmitAnswer(groupId, collectionId, postId);
    const retakeMutation = useRetakeAnswer(groupId, collectionId, postId);
    const updateMutation = useUpdatePost(groupId, collectionId);
    const deleteMutation = useDeletePost(groupId, collectionId);

    const [examOpen, setExamOpen] = useState(false);
    const [answerOpen, setAnswerOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // ---------------- trạng thái tải ----------------

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <p className="text-sm text-muted-foreground">{txt('loading')}</p>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <Link
                    href={`/group/${groupId}/collection/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>
                <p className="mt-6 text-sm text-muted-foreground">
                    {txt('post_not_found')}
                </p>
            </div>
        );
    }

    const permission = post.permission ?? {
        create: false,
        update: false,
        delete: false,
        take: false,
    };

    const expired = isPastDeadline(post.deadline_at);
    const deadlineLabel = formatDeadline(post.deadline_at);

    const hasAnswered = !!myAnswer;
    const canTake = permission.take && !expired && !hasAnswered;
    const canRetakeNow =
        hasAnswered && post.retake === Retake.BEFORE_DATELINE && !expired;

    const isSubmitting = submitMutation.isPending || retakeMutation.isPending;

    const initialDraft = hasAnswered
        ? buildDraftFromSubmission(post.content ?? [], myAnswer.answer_content)
        : undefined;

    /** Nộp bài mới hoặc làm lại — cả 2 đều gửi cùng shape `answer_content` */
    const handleSubmit = async (payload: SubmissionSection[]) => {
        if (hasAnswered && myAnswer) {
            await retakeMutation.mutateAsync({
                answer_id: myAnswer.id,
                answer_content: payload,
            });
        } else {
            await submitMutation.mutateAsync({ answer_content: payload });
        }
        setExamOpen(false);
        setAnswerOpen(true);
    };

    const handleEdit = async (values: PostMetaFormValues) => {
        await updateMutation.mutateAsync({
            id: post.id,
            body: {
                title: values.title,
                description: values.description,
                deadline_at: toDeadlineIso(values.deadline_at),
                view_each_other_answer: values.view_each_other_answer,
            },
        });
        setEditOpen(false);
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(post.id);
        setDeleteOpen(false);
        router.push(`/group/${groupId}/collection/${collectionId}`);
    };

    const editInitialValues: PostMetaFormValues = {
        title: post.title,
        description: post.description ?? '',
        deadline_at: toDateTimeLocal(post.deadline_at),
        retake: post.retake,
        view_each_other_answer: post.view_each_other_answer,
    };

    const viewLabel =
        post.view_each_other_answer === View_Each_Other_Answer.NEVER
            ? txt('view_never')
            : post.view_each_other_answer ===
                View_Each_Other_Answer.AFTER_ANSWER
              ? txt('view_after_answer')
              : txt('view_after_deadline');

    const showOthersAnswers =
        permission.update ||
        post.view_each_other_answer !== View_Each_Other_Answer.NEVER;

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* ================= Header ================= */}
            <div className="border-b border-border pb-5">
                <Link
                    href={`/group/${groupId}/collection/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">{post.title}</h1>

                        {post.description && (
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {post.description}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <AlarmClock size={11} />
                                {deadlineLabel ?? txt('no_deadline')}
                            </Badge>

                            {expired && (
                                <Badge
                                    variant="secondary"
                                    className="text-red-600"
                                >
                                    {txt('deadline_passed')}
                                </Badge>
                            )}

                            <Badge variant="secondary" className="gap-1">
                                <Eye size={11} />
                                {viewLabel}
                            </Badge>

                            {post.retake === Retake.BEFORE_DATELINE && (
                                <Badge variant="secondary">
                                    {txt('retake_allowed')}
                                </Badge>
                            )}

                            <Badge variant="secondary" className="gap-1">
                                <FileText size={11} />
                                {post.content?.length ?? 0}{' '}
                                {txt('section_unit')}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                        {permission.update && (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() => setEditOpen(true)}
                            >
                                <Pencil size={14} />
                                {txt('edit')}
                            </Button>
                        )}

                        {permission.delete && (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 size={14} />
                                {txt('delete')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= Điểm + hành động làm bài ================= */}
            <section className="mt-6 rounded-2xl border-2 border-border bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        {hasAnswered ? (
                            <>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {txt('your_score')}
                                </p>
                                <p className="mt-1 text-2xl font-bold tabular-nums">
                                    {myAnswer?.point ?? '—'}
                                    <span className="text-base font-normal text-muted-foreground">
                                        /{myAnswer?.max_point ?? '—'}
                                    </span>
                                </p>
                                {myAnswer?.status ===
                                    Post_Answer_Status.PENDING && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {txt('pending_grade_hint')}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium">
                                    {expired
                                        ? txt('deadline_passed')
                                        : txt('not_submitted_yet')}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {txt('take_hint')}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {hasAnswered && (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() => setAnswerOpen(true)}
                            >
                                <FileText size={14} />
                                {txt('view_my_answer')}
                            </Button>
                        )}

                        {(canTake || canRetakeNow) && (
                            <Button
                                type="button"
                                className="gap-2"
                                onClick={() => setExamOpen(true)}
                            >
                                {canRetakeNow ? (
                                    <RotateCcw size={14} />
                                ) : (
                                    <Play size={14} />
                                )}
                                {canRetakeNow
                                    ? txt('retake_exam')
                                    : txt('take_exam')}
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= Nội dung đề ================= */}
            <section className="mt-8">
                <h2 className="text-lg font-semibold">
                    {txt('exercise_content')}
                </h2>

                <div className="mt-4 space-y-4">
                    {(post.content ?? []).map((section, sectionIndex) => (
                        <SectionView
                            key={sectionIndex}
                            index={sectionIndex}
                            section={section}
                            allAnswers={post.correct_answer}
                            // Học viên chưa làm bài sẽ KHÔNG nhận được
                            // `correct_answer` từ BE -> tự động ẩn đáp án
                            showAnswers={!!post.correct_answer}
                        />
                    ))}
                </div>
            </section>

            {/* ================= Bài làm của học viên khác ================= */}
            <OthersAnswers
                groupId={groupId}
                collectionId={collectionId}
                postId={postId}
                post={post}
                canGrade={!!permission.update}
                enabled={showOthersAnswers}
            />

            {/* ================= Overlays ================= */}
            {(examOpen || answerOpen) && (
                <>
                    <ExamOverlay
                        open={examOpen}
                        post={post}
                        initialAnswers={initialDraft}
                        onClose={() => setExamOpen(false)}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />

                    {myAnswer && (
                        <AnswerDetailOverlay
                            open={answerOpen}
                            post={post}
                            answer={myAnswer}
                            onClose={() => setAnswerOpen(false)}
                        />
                    )}
                </>
            )}

            {/* ================= Modals ================= */}
            <PostMetaModal
                open={editOpen}
                mode="edit"
                initialValues={editInitialValues}
                onClose={() => setEditOpen(false)}
                onSubmit={handleEdit}
                isSubmitting={updateMutation.isPending}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_post')}
                description={txt('confirm_delete_post_desc', {
                    title: post.title,
                })}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
