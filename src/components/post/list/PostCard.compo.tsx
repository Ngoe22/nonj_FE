'use client';

import { Link } from '@/i18n/navigation';
import {
    AlarmClock,
    ArrowRight,
    Eye,
    FileText,
    RotateCcw,
    SquarePen,
    Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import {
    PostInfoBadge,
    viewEachOtherLabel,
} from '@/components/post/_share/PostInfoBadge.compo';
import { Button } from '@/components/ui/button';
import { formatDeadline } from '@/lib/format/datetime';
import { isPastDeadline, type Post } from '@/types/post/post.type';
import { Retake } from '@/enum/post/post.enum';

interface Props {
    groupId: string;
    collectionId: string;
    post: Post;
    onEdit: () => void;
    onDelete: () => void;
}

export default function PostCard({
    groupId,
    collectionId,
    post,
    onEdit,
    onDelete,
}: Props) {
    const txt = useTranslations('Post');

    const deadline = formatDeadline(post.deadline_at);
    const expired = isPastDeadline(post.deadline_at);
    const canManage = post.permission?.update || post.permission?.delete;

    return (
        <div className="group relative rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong hover:shadow-sm">
            <Link
                href={`/group/${groupId}/collection/${collectionId}/post/${post.id}`}
                className="block pr-20"
            >
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {post.title}
                        </h3>

                        {post.description && (
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {post.description}
                            </p>
                        )}

                        {/* Nhãn + giá trị, giống hệt trang chi tiết */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <PostInfoBadge
                                icon={<AlarmClock size={11} />}
                                label={txt('label_deadline')}
                                value={deadline ?? txt('no_deadline')}
                            />

                            {expired && (
                                <Badge
                                    variant="secondary"
                                    className="text-destructive"
                                >
                                    {txt('deadline_passed')}
                                </Badge>
                            )}

                            <PostInfoBadge
                                icon={<Eye size={11} />}
                                label={txt('label_view_each_other')}
                                value={viewEachOtherLabel(
                                    txt,
                                    post.view_each_other_answer,
                                )}
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

                    <ArrowRight
                        size={18}
                        className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                </div>
            </Link>

            {canManage && (
                <div className="absolute right-3 top-3 flex gap-1">
                    {post.permission?.update && (
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <SquarePen size={15} />
                        </Button>
                    )}
                    {post.permission?.delete && (
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 size={15} />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
