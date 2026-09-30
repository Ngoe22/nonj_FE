'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PostMetaFields } from '@/components/post/modal/PostMetaFields.compo';

import {
    postMetaDefaultValues,
    postMetaSchema,
    type PostMetaFormValues,
} from '@/schemas/post/post.schema';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    initialValues?: PostMetaFormValues;
    onClose: () => void;
    onSubmit: (values: PostMetaFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

/**
 * Bước 1 của "soạn thủ công" (bước 2 là builder nội dung), và cũng là modal
 * SỬA post — sửa post chỉ cho đổi title/description/deadline/view_each_other.
 */
export default function PostMetaModal({
    open,
    mode,
    initialValues,
    onClose,
    onSubmit,
    isSubmitting,
}: Props) {
    const txt = useTranslations('Post');

    const form = useForm<PostMetaFormValues>({
        resolver: zodResolver(postMetaSchema),
        defaultValues: postMetaDefaultValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        if (!open) return;
        reset(initialValues ?? postMetaDefaultValues);
    }, [open, initialValues, reset]);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[90vh] w-11/12 max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? txt('create_post') : txt('edit_post')}
                    </DialogTitle>
                </DialogHeader>

                {mode === 'edit' && (
                    <p className="rounded-xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
                        {txt('edit_post_note')}
                    </p>
                )}

                <FormProvider {...form}>
                    <form onSubmit={submit} className="space-y-4">
                        <PostMetaFields hideRetake={mode === 'edit'} />

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                {txt('cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? txt('saving')
                                    : mode === 'edit'
                                      ? txt('confirm')
                                      : txt('next_step')}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
