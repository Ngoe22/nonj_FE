'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PostMetaFields } from '@/components/post/modal/PostMetaFields.compo';

import { useGetMyCollectionsPicker } from '@/hooks/question_preparation/question_preparation_collection.hook';
import { useGetMyPreparationsPicker } from '@/hooks/question_preparation/question_preparation.hook';
import {
    postMetaDefaultValues,
    postMetaSchema,
    toDeadlineIso,
    type PostMetaFormValues,
} from '@/schemas/post/post.schema';
import type { CreatePostFromPreparationVars } from '@/types/post/post.type';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (vars: CreatePostFromPreparationVars) => void | Promise<void>;
    isSubmitting?: boolean;
}

// PHẢI có `bg-surface text-foreground`: nếu không, popup của <select> do browser
// vẽ sẽ là nền sáng + chữ trắng (thừa hưởng từ theme tối) -> không đọc được.
const fieldClass =
    'mt-1 w-full rounded-md border-2 border-status-info bg-surface p-2 text-sm text-foreground outline-none';

/**
 * Giao bài bằng cách lấy từ kho `question_preparation` của chính mình.
 * BE COPY nội dung sang post — không tham chiếu, nên sau này sửa kho cá nhân
 * không làm đổi đề trong nhóm.
 */
export default function PickPreparationModal({
    open,
    onClose,
    onSubmit,
    isSubmitting,
}: Props) {
    const txt = useTranslations('Post');

    const { data: collections, isLoading: loadingCollections } =
        useGetMyCollectionsPicker();

    const [collectionId, setCollectionId] = useState('');
    const [preparationId, setPreparationId] = useState('');

    // React khuyến nghị "điều chỉnh state khi prop đổi" NGAY TRONG RENDER thay
    // cho useEffect — tránh cascading render (rule react-hooks/set-state-in-effect).
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setCollectionId('');
            setPreparationId('');
        }
    }

    // Chưa chọn thư mục -> mặc định cái đầu tiên, SUY RA khi render (không effect)
    const effectiveCollectionId = collectionId || collections?.[0]?.id || '';

    // Dùng `isPending` (KHÔNG phải `isLoading`): với query bị `enabled: false`,
    // TanStack v5 trả `isLoading = false` nhưng `isPending = true` -> dùng
    // `isLoading` sẽ rơi ngay vào nhánh "chưa có đề" dù thực ra chưa chọn gì.
    const {
        data: preparations,
        isPending: loadingPreparations,
        isError: preparationError,
    } = useGetMyPreparationsPicker(effectiveCollectionId);

    const form = useForm<PostMetaFormValues>({
        resolver: zodResolver(postMetaSchema),
        defaultValues: postMetaDefaultValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, reset, setValue } = form;

    // reset form mỗi lần mở (RHF reset không phải React setState nên không bị
    // rule set-state-in-effect bắt)
    useEffect(() => {
        if (open) reset(postMetaDefaultValues);
    }, [open, reset]);

    const submit = handleSubmit(async (values) => {
        if (!preparationId) return;
        await onSubmit({
            preparation_id: preparationId,
            title: values.title,
            description: values.description,
            deadline_at: toDeadlineIso(values.deadline_at),
            retake: values.retake,
            view_each_other_answer: values.view_each_other_answer,
        });
    });

    const noCollections =
        !loadingCollections && (collections?.length ?? 0) === 0;

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92dvh] w-[95vw] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{txt('create_from_preparation')}</DialogTitle>
                </DialogHeader>

                {noCollections ? (
                    <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        {txt('no_collections_to_pick')}
                    </p>
                ) : (
                    <FormProvider {...form}>
                        <form onSubmit={submit} className="space-y-5">
                            {/* -------- chọn thư mục -------- */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('pick_collection')}
                                </label>
                                <select
                                    value={effectiveCollectionId}
                                    onChange={(e) => {
                                        setCollectionId(e.target.value);
                                        setPreparationId('');
                                        // Đổi thư mục -> xoá tiêu đề auto-fill của
                                        // đề cũ, tránh gửi nhầm tiêu đề của thư mục khác.
                                        setValue('title', '', {
                                            shouldDirty: true,
                                        });
                                    }}
                                    className={fieldClass}
                                >
                                    {(collections ?? []).map((collection) => (
                                        <option
                                            key={collection.id}
                                            value={collection.id}
                                        >
                                            {collection.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* -------- chọn đề -------- */}
                            <div>
                                <label className="mb-1 flex items-center justify-between text-sm font-medium">
                                    <span>{txt('pick_preparation')}</span>
                                    {/* Đếm để người dùng thấy list ĐÃ load, không
                                        tưởng là trống khi đang tải */}
                                    {!loadingPreparations &&
                                        (preparations?.length ?? 0) > 0 && (
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {preparations!.length}{' '}
                                                {txt('section_unit')}
                                            </span>
                                        )}
                                </label>

                                {!effectiveCollectionId ? (
                                    <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                                        {txt('pick_collection_first')}
                                    </p>
                                ) : loadingPreparations ? (
                                    <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                        {txt('loading')}
                                    </p>
                                ) : preparationError ? (
                                    <p className="rounded-xl border border-dashed border-destructive/40 p-4 text-center text-xs text-destructive">
                                        {txt('load_failed')}
                                    </p>
                                ) : (preparations?.length ?? 0) === 0 ? (
                                    <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                                        {txt('no_preparation_in_collection')}
                                    </p>
                                ) : (
                                    <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                                        {(preparations ?? []).map(
                                            (preparation) => (
                                                <button
                                                    key={preparation.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setPreparationId(
                                                            preparation.id,
                                                        );
                                                        // chọn đề -> điền luôn
                                                        // tiêu đề (vẫn sửa được)
                                                        setValue(
                                                            'title',
                                                            preparation.title,
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                    }}
                                                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                                                        preparationId ===
                                                        preparation.id
                                                            ? 'border-foreground bg-surface-hover'
                                                            : 'border-border hover:bg-surface-hover'
                                                    }`}
                                                >
                                                    <span className="flex-1 truncate">
                                                        {preparation.title}
                                                    </span>
                                                    <span className="shrink-0 text-[11px] text-muted-foreground">
                                                        {
                                                            preparation.content
                                                                ?.length
                                                        }{' '}
                                                        {txt('section_unit')}
                                                    </span>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* -------- các field bọc ngoài -------- */}
                            <div className="border-t border-dashed border-border pt-4">
                                <PostMetaFields />
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
                                    type="submit"
                                    disabled={isSubmitting || !preparationId}
                                >
                                    {isSubmitting
                                        ? txt('saving')
                                        : txt('confirm')}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </DialogContent>
        </Dialog>
    );
}
