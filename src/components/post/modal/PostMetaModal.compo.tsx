'use client';

import { useMemo } from 'react';
import { useResetWhenOpen } from '@/hooks/_share/form/use_reset_when_open.hook';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PostMetaFields } from '@/components/post/modal/PostMetaFields.compo';

import {
    buildPostMetaSchema,
    postMetaDefaultValues,
    type PostMetaFormValues,
} from '@/schemas/post/post.schema';
import {
    collectErrorKeys,
    translateErrorKey,
} from '@/helper/formError/formError.helper';

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
 * SỬA post.
 *
 * Sửa post cho đổi: title / description / deadline / chế độ xem bài nhau /
 * chế độ làm lại. Nội dung câu hỏi và đáp án bị khoá (xem BE `UpdatePostDto`).
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
    const txtErr = useTranslations('Shema');

    // Schema phụ thuộc hạn ĐANG LƯU để biết hạn quá khứ là "giữ nguyên" hay "đổi mới"
    const schema = useMemo(
        () => buildPostMetaSchema(initialValues?.deadline_at),
        [initialValues?.deadline_at],
    );

    const form = useForm<PostMetaFormValues>({
        resolver: zodResolver(schema),
        defaultValues: postMetaDefaultValues,
        // 'onChange' (không phải 'onSubmit'): lỗi phải phản ánh giá trị ĐANG gõ.
        // Với 'onSubmit', lỗi cũ vẫn hiện dù ô đã có chữ -> trông như app lỗi.
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        handleSubmit,
        reset,
        formState: { errors, submitCount },
    } = form;

    // `initialValues` là OBJECT do cha truyền — nếu cha tạo literal mới mỗi render
    // (không useMemo) thì effect cũ chạy mỗi render -> nuốt nội dung đang gõ.
    // `useResetWhenOpen` so theo NỘI DUNG nên miễn nhiễm với lỗi đó.
    useResetWhenOpen(open, initialValues ?? postMetaDefaultValues, reset);

    const errorKeys = collectErrorKeys(errors);
    const showSummary = submitCount > 0 && errorKeys.length > 0;

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            {/*
              `sm:max-w-xl` (không phải `max-w-xl`) để ghi đè `sm:max-w-md`
              mặc định của DialogContent — thiếu tiền tố sm: thì trên desktop
              modal vẫn bị kẹp ở 448px.
            */}
            <DialogContent className="flex max-h-[92dvh] w-[95vw] flex-col gap-4 overflow-hidden p-5 sm:max-w-xl sm:p-6">
                <DialogHeader className="shrink-0 pr-10">
                    <DialogTitle>
                        {mode === 'create' ? txt('create_post') : txt('edit_post')}
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form
                        onSubmit={submit}
                        className="flex min-h-0 flex-1 flex-col gap-4"
                    >
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                            {mode === 'edit' && (
                                <p className="rounded-xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
                                    {txt('edit_post_note')}
                                </p>
                            )}

                            {showSummary && (
                                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
                                    <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                                        <AlertCircle size={14} />
                                        {txt('form_has_errors')}
                                    </p>
                                    <ul className="mt-1 ml-5 list-disc space-y-0.5 text-xs text-destructive/90">
                                        {errorKeys.map((key) => (
                                            <li key={key}>
                                                {translateErrorKey(txtErr, key)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <PostMetaFields />
                        </div>

                        <div className="flex shrink-0 justify-end gap-3 border-t pt-4">
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
