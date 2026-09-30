'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import PostCard from '@/components/post/list/PostCard.compo';
import CreatePostChoiceModal from '@/components/post/modal/CreatePostChoiceModal.compo';
import PostMetaModal from '@/components/post/modal/PostMetaModal.compo';
import PickPreparationModal from '@/components/post/modal/PickPreparationModal.compo';
import PreparationBuilderModal from '@/components/question_preparation/preparation/modal/PreparationBuilderModal.compo';
import ConfirmModal from '@/components/group/_share/ConfirmModal.compo';
import { InfiniteScrollList } from '@/components/_share/infinity_scroll/InfiniteScrollList.compo';

import {
    useCreatePost,
    useCreatePostFromPreparation,
    useDeletePost,
    useGetPosts,
    useUpdatePost,
} from '@/hooks/post/post.hook';
import {
    postMetaDefaultValues,
    toDeadlineIso,
    type PostMetaFormValues,
} from '@/schemas/post/post.schema';
import { toDateTimeLocal } from '@/lib/format/datetime';
import { splitQuestionSections } from '@/types/question_preparation/question_preparation.type';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import type {
    CreatePostFromPreparationVars,
    Post,
} from '@/types/post/post.type';

interface Props {
    groupId: string;
    collectionId: string;
    canCreate: boolean;
}

export default function PostList({ groupId, collectionId, canCreate }: Props) {
    const txt = useTranslations('Post');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useGetPosts(groupId, collectionId);

    const createMutation = useCreatePost(groupId, collectionId);
    const createFromPreparationMutation = useCreatePostFromPreparation(
        groupId,
        collectionId,
    );
    const updateMutation = useUpdatePost(groupId, collectionId);
    const deleteMutation = useDeletePost(groupId, collectionId);

    // ---------------- state điều khiển modal ----------------
    const [choiceOpen, setChoiceOpen] = useState(false);

    // soạn thủ công = 2 bước: meta -> builder nội dung
    const [metaOpen, setMetaOpen] = useState(false);
    const [builderOpen, setBuilderOpen] = useState(false);
    const [draftMeta, setDraftMeta] = useState<PostMetaFormValues | null>(null);

    const [pickOpen, setPickOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Post | null>(null);

    const posts = data?.pages.flatMap((page) => page) ?? [];

    // ---------------- handlers ----------------

    /** Bước 1 xong -> mở builder nội dung */
    const handleMetaStep = (values: PostMetaFormValues) => {
        setDraftMeta(values);
        setMetaOpen(false);
        setBuilderOpen(true);
    };

    /** Bước 2: ghép meta + nội dung rồi gửi BE */
    const handleManualCreate = async (
        values: QuestionPreparationFormValues,
    ) => {
        if (!draftMeta) return;
        const { content, correct_answer } = splitQuestionSections(
            values.sections,
        );

        await createMutation.mutateAsync({
            title: values.title || draftMeta.title,
            description: draftMeta.description,
            deadline_at: toDeadlineIso(draftMeta.deadline_at),
            retake: draftMeta.retake,
            view_each_other_answer: draftMeta.view_each_other_answer,
            content,
            correct_answer,
        });

        setBuilderOpen(false);
        setDraftMeta(null);
    };

    /** Lấy từ kho — BE copy nội dung */
    const handleFromPreparation = async (
        vars: CreatePostFromPreparationVars,
    ) => {
        await createFromPreparationMutation.mutateAsync(vars);
        setPickOpen(false);
    };

    const handleEdit = async (values: PostMetaFormValues) => {
        if (!selected) return;
        await updateMutation.mutateAsync({
            id: selected.id,
            body: {
                title: values.title,
                description: values.description,
                deadline_at: toDeadlineIso(values.deadline_at),
                view_each_other_answer: values.view_each_other_answer,
            },
        });
        setEditOpen(false);
        setSelected(null);
    };

    const handleDelete = async () => {
        if (!selected) return;
        await deleteMutation.mutateAsync(selected.id);
        setDeleteOpen(false);
        setSelected(null);
    };

    const editInitialValues: PostMetaFormValues | undefined = selected
        ? {
              title: selected.title,
              description: selected.description ?? '',
              deadline_at: toDateTimeLocal(selected.deadline_at),
              retake: selected.retake,
              view_each_other_answer: selected.view_each_other_answer,
          }
        : undefined;

    return (
        <>
            <section className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{txt('posts')}</h2>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setChoiceOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-foreground px-3.5 py-2 text-sm font-medium text-background"
                        >
                            <Plus size={15} />
                            {txt('create_post')}
                        </button>
                    )}
                </div>

                <InfiniteScrollList<Post>
                    items={posts}
                    getKey={(post) => post.id}
                    renderItem={(post) => (
                        <PostCard
                            groupId={groupId}
                            collectionId={collectionId}
                            post={post}
                            onEdit={() => {
                                setSelected(post);
                                setEditOpen(true);
                            }}
                            onDelete={() => {
                                setSelected(post);
                                setDeleteOpen(true);
                            }}
                        />
                    )}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    className="space-y-3"
                    emptyComponent={
                        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border">
                            <p className="text-sm text-muted-foreground">
                                {txt('no_posts')}
                            </p>
                        </div>
                    }
                />
            </section>

            {/* ================= Modals ================= */}
            <CreatePostChoiceModal
                open={choiceOpen}
                onClose={() => setChoiceOpen(false)}
                onManual={() => {
                    setChoiceOpen(false);
                    setDraftMeta(postMetaDefaultValues);
                    setMetaOpen(true);
                }}
                onFromPreparation={() => {
                    setChoiceOpen(false);
                    setPickOpen(true);
                }}
            />

            <PostMetaModal
                open={metaOpen}
                mode="create"
                onClose={() => {
                    setMetaOpen(false);
                    setDraftMeta(null);
                }}
                onSubmit={handleMetaStep}
            />

            <PreparationBuilderModal
                open={builderOpen}
                mode="create"
                titleOverride={txt('create_manually')}
                onClose={() => {
                    setBuilderOpen(false);
                    setDraftMeta(null);
                }}
                onSubmit={handleManualCreate}
                isSubmitting={createMutation.isPending}
            />

            <PickPreparationModal
                open={pickOpen}
                onClose={() => setPickOpen(false)}
                onSubmit={handleFromPreparation}
                isSubmitting={createFromPreparationMutation.isPending}
            />

            <PostMetaModal
                open={editOpen}
                mode="edit"
                initialValues={editInitialValues}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSubmit={handleEdit}
                isSubmitting={updateMutation.isPending}
            />

            <ConfirmModal
                open={deleteOpen}
                title={txt('confirm_delete_post')}
                description={txt('confirm_delete_post_desc', {
                    title: selected?.title ?? '',
                })}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelected(null);
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}
