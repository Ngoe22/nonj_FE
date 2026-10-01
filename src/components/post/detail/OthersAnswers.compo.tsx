'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ClipboardCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GradeAnswerModal from '@/components/post/grade/GradeAnswerModal.compo';

import { useGetOthersAnswers, useGradeAnswer } from '@/hooks/post/post_answer.hook';
import { Post_Answer_Status } from '@/enum/post_answer/post_answer.enum';
import type { Post } from '@/types/post/post.type';
import type {
    GradeAnswerVars,
    PostAnswer,
} from '@/types/post_answer/post_answer.type';

interface Props {
    groupId: string;
    collectionId: string;
    postId: string;
    post: Post;
    /** admin/founder của nhóm mới được chấm */
    canGrade: boolean;
    enabled: boolean;
    /** Ẩn tiêu đề khi component nằm trong tab (tab đã có nhãn) */
    hideHeading?: boolean;
}

/**
 * Danh sách bài làm của học viên.
 *
 * Với admin/founder, BE trả kèm `review_content` để biết phần nào đã chấm tay.
 * Với member, BE KHÔNG trả `review_content` vì nó chứa đáp án đúng.
 */
export function OthersAnswers({
    groupId,
    collectionId,
    postId,
    post,
    canGrade,
    enabled,
    hideHeading,
}: Props) {
    const txt = useTranslations('Post');

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetOthersAnswers(groupId, collectionId, postId, enabled);

    const gradeMutation = useGradeAnswer(groupId, collectionId, postId);

    const [grading, setGrading] = useState<PostAnswer | null>(null);

    if (!enabled || isError) return null;

    const answers = data?.pages.flatMap((page) => page) ?? [];

    const handleGrade = async (vars: GradeAnswerVars) => {
        await gradeMutation.mutateAsync(vars);
        setGrading(null);
    };

    return (
        <section className={hideHeading ? '' : 'mt-8'}>
            {!hideHeading && (
                <h2 className="text-lg font-semibold">
                    {txt('others_answers')}
                </h2>
            )}

            {isLoading && (
                <p className="mt-2 text-sm text-muted-foreground">
                    {txt('loading')}
                </p>
            )}

            {!isLoading && answers.length === 0 && (
                <div className="mt-3 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                        {txt('no_others_answers')}
                    </p>
                </div>
            )}

            {answers.length > 0 && (
                <div className="mt-3 space-y-2">
                    {answers.map((answer) => (
                        <div
                            key={answer.id}
                            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 "
                        >

                            <div className={`flex flex-col flex-1`} >
                                <span className="min-w-0  truncate text-sm">
                                    {answer.user?.nickname}
                                 </span>
                                <span className="min-w-0  text-muted-foreground   text-xs">
                                    @{answer.user?.user_name}
                                 </span>

                            </div>


                            {answer.status === Post_Answer_Status.PENDING && (
                                <Badge variant="secondary">
                                    {txt('pending_grade')}
                                </Badge>
                            )}

                            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                                {answer.point ?? '—'}/{answer.max_point ?? '—'}
                            </span>

                            {canGrade && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0 gap-1.5"
                                    onClick={() => setGrading(answer)}
                                >
                                    <ClipboardCheck size={13} />
                                    {answer.status ===
                                    Post_Answer_Status.PENDING
                                        ? txt('grade')
                                        : txt('regrade')}
                                </Button>
                            )}
                        </div>
                    ))}

                    {hasNextPage && (
                        <button
                            type="button"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-surface-hover disabled:opacity-50"
                        >
                            {txt('load_more')}
                        </button>
                    )}
                </div>
            )}

            <GradeAnswerModal
                open={!!grading}
                post={post}
                answer={grading}
                onClose={() => setGrading(null)}
                onSubmit={handleGrade}
                isSubmitting={gradeMutation.isPending}
            />
        </section>
    );
}
