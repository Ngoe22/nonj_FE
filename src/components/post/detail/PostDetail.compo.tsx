'use client';

import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import {
    AlarmClock,
    ArrowLeft,
    Eye,
    FileText,
    Pencil,
    MoreVertical,
    Play,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import ReportButton from '@/components/_share/report/ReportButton.compo';
import { Target_Type } from '@/enum/report/report.enum';

import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SectionView } from '@/components/question_preparation/preparation/detail/SectionView.compo';
import { ExamOverlay } from '@/components/post/exam/ExamOverlay.compo';
import { buildDraftFromSubmission } from '@/components/post/exam/useExamSession.hook';
import { AnswerDetailOverlay } from '@/components/post/answer/AnswerDetailOverlay.compo';
import { OthersAnswers } from '@/components/post/detail/OthersAnswers.compo';
import {
    PostInfoBadge,
    viewEachOtherLabel,
} from '@/components/post/_share/PostInfoBadge.compo';
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
    const [reportMenuOpen, setReportMenuOpen] = useState(false);
    const { groupId, collectionId, postId } = usePostParams();

    const { data: post, isLoading, isError } = useGetPost(
        groupId,
        collectionId,
        postId,
    );
    const { data: myAnswer } = useGetMyAnswer(groupId, collectionId, postId);

    const submitMutation = useSubmitAnswer(groupId, collectionId, postId);
    const retakeMutation = useRetakeAnswer(groupId, collectionId, postId);
    // Truyền postId -> optimistic cập nhật NGAY trang chi tiết, không chờ refetch
    const updateMutation = useUpdatePost(groupId, collectionId, postId);
    const deleteMutation = useDeletePost(groupId, collectionId);

    const [examOpen, setExamOpen] = useState(false);

    /**
     * Giá trị khởi tạo cho modal Sửa.
     *
     * ⚠️ PHẢI là `useMemo` VÀ phải đặt TRƯỚC các `return` sớm bên dưới (Rules of
     * Hooks — gọi hook sau return sớm sẽ crash). Object literal tạo mới mỗi render
     * từng làm modal reset form liên tục, nuốt nội dung đang gõ.
     */
    const editInitialValues = useMemo<PostMetaFormValues | undefined>(
        () =>
            post
                ? {
                      title: post.title,
                      description: post.description ?? '',
                      deadline_at: toDateTimeLocal(post.deadline_at),
                      retake: post.retake,
                      view_each_other_answer: post.view_each_other_answer,
                  }
                : undefined,
        [post],
    );
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

    /**
     * CHỦ ĐÍCH: chỉ admin/founder xem được nội dung đề ở tab này.
     *
     * Học viên KHÔNG xem trước nội dung — đề chỉ hiện trong lúc làm bài (màn
     * thi). Vì vậy đừng đổi thành `|| hasAnswered`: nộp bài xong vẫn không hiện
     * ở đây.
     */
    const canSeeContent = permission.update;
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
                retake: values.retake,
            },
        });
        setEditOpen(false);
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(post.id);
        setDeleteOpen(false);
        router.push(`/group/${groupId}/collection/${collectionId}`);
    };

    const viewLabel = viewEachOtherLabel(txt, post.view_each_other_answer);

    const showOthersAnswers =
        permission.update ||
        post.view_each_other_answer !== View_Each_Other_Answer.NEVER;

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* ================= Header ================= */}
            <div className="border-b border-border pb-5">
                <div className="flex items-center justify-between">
                    <Link
                        href={`/group/${groupId}/collection/${collectionId}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft size={17} />
                        {txt('back')}
                    </Link>

                    {/* 3 chấm đối diện nút back -> báo cáo vi phạm */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setReportMenuOpen((o) => !o)}
                            className="rounded-lg p-2 text-muted-foreground transition hover:bg-surface-hover"
                            aria-label={txt('report')}
                        >
                            <MoreVertical size={18} />
                        </button>
                        {reportMenuOpen && (
                            <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
                                <ReportButton
                                    target_type={Target_Type.POST}
                                    target_id={postId}
                                    variant="menu"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">{post.title}</h1>

                        {post.description && (
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {post.description}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <PostInfoBadge
                                icon={<AlarmClock size={11} />}
                                label={txt('label_deadline')}
                                value={deadlineLabel ?? txt('no_deadline')}
                            />

                            {expired && (
                                <Badge
                                    variant="secondary"
                                    className="text-red-600"
                                >
                                    {txt('deadline_passed')}
                                </Badge>
                            )}

                            <PostInfoBadge
                                icon={<Eye size={11} />}
                                label={txt('label_view_each_other')}
                                value={viewLabel}
                            />

                            <PostInfoBadge
                                icon={<RotateCcw size={11} />}
                                label={txt('label_retake')}
                                value={
                                    post.retake === Retake.BEFORE_DATELINE
                                        ? txt('retake_allowed')
                                        : txt('retake_not_allowed')
                                }
                            />

                            <PostInfoBadge
                                icon={<FileText size={11} />}
                                label={txt('label_section_count')}
                                value={`${post.content?.length ?? 0} ${txt('section_unit')}`}
                            />
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

            {/*
              Nội dung đề và Bài làm để THÀNH TAB: đề dài sẽ đẩy phần bài làm
              xuống rất sâu, giáo viên phải cuộn mãi mới chấm được.
            */}
            <Tabs defaultValue="content" className="mt-8">
                <TabsList className="grid h-auto w-full grid-cols-2">
                    <TabsTrigger value="content">
                        {txt('exercise_content')}
                    </TabsTrigger>
                    <TabsTrigger value="submissions">
                        {txt('others_answers')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-5">
                    {canSeeContent ? (
                        <div className="space-y-4">
                            {(post.content ?? []).map(
                                (section, sectionIndex) => (
                                    <SectionView
                                        key={sectionIndex}
                                        index={sectionIndex}
                                        section={section}
                                        allAnswers={post.correct_answer}
                                        // Chưa làm bài thì BE cũng không trả
                                        // `correct_answer` -> tự động ẩn đáp án
                                        showAnswers={!!post.correct_answer}
                                    />
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                            {txt('content_admin_only')}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="submissions" className="mt-5">
                    <OthersAnswers
                        groupId={groupId}
                        collectionId={collectionId}
                        postId={postId}
                        post={post}
                        canGrade={!!permission.update}
                        enabled={showOthersAnswers}
                        hideHeading
                    />
                </TabsContent>
            </Tabs>

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
