'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import Modal from '@/components/_share/common_modal/CommonModal.compo';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import {CreateCollectionFormValues, createCollectionSchema} from "@/schemas/post_collection/post_collection.schema";
import { useResetWhenOpen } from '@/hooks/_share/form/use_reset_when_open.hook';



// =============================

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    initialDesc?: string;
    onClose: () => void;
    onSubmit: (data: CreateCollectionFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export default function CollectionModal({
                                            open,
                                            mode,
                                            initialTitle = '',
                                            initialDesc = '',
                                            onClose,
                                            onSubmit,
                                            isSubmitting = false,
                                        }: Props) {
    const txt = useTranslations('Post_collections');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateCollectionFormValues>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: { title: initialTitle, desc: initialDesc },
        // 'onChange' (không phải 'onSubmit'): lỗi phải phản ánh giá trị ĐANG gõ.
        // Với 'onSubmit', lỗi cũ vẫn hiện dù ô đã có chữ -> trông như app lỗi.
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    // ⚠️ KHÔNG dùng `useEffect(..., [reset])`: `reset` của RHF đổi identity mỗi
    // render -> effect chạy liên tục -> xoá form state trong khi ô vẫn hiện chữ
    // => ô có chữ mà vẫn báo "Vui lòng nhập nội dung".
    useResetWhenOpen(open, { title: initialTitle, desc: initialDesc }, reset);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });
    //
    // const descError = errors.desc?.message
    //     ? { ...errors.desc, message: txtErr(errors.desc.message as any) }
    //     : undefined;

    return (
        <Modal
            open={open}
            title={
                mode === 'create'
                    ? txt('modal_title_create')
                    : txt('modal_title_edit')
            }
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        {txt('title_label')}
                    </label>
                    <Input
                        register={register('title')}
                        error={errors.title}
                        placeholder={txt('title_placeholder')}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        {txt('description')}
                    </label>
                    <Input
                        register={register('desc')}
                        error={errors.desc}
                        type="textarea"
                        placeholder={txt('desc_placeholder')}
                        inputStyles="mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info min-h-[100px] resize-y"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover disabled:opacity-50"
                    >
                        {txt('cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
                    >
                        {isSubmitting ? txt('saving') : txt('confirm')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}