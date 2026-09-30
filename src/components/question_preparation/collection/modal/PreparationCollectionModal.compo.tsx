'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';

import {
    collectionDefaultValues,
    collectionFormSchema,
    type CollectionFormValues,
} from '@/schemas/question_preparation/question_preparation_collection.schema';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    initialDesc?: string;
    onClose: () => void;
    onSubmit: (data: CollectionFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export default function PreparationCollectionModal({
    open,
    mode,
    initialTitle = '',
    initialDesc = '',
    onClose,
    onSubmit,
    isSubmitting = false,
}: Props) {
    const txt = useTranslations('Question_preparation');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CollectionFormValues>({
        resolver: zodResolver(collectionFormSchema),
        defaultValues: collectionDefaultValues,
        mode: 'onSubmit',
    });

    useEffect(() => {
        if (open) reset({ title: initialTitle, desc: initialDesc });
    }, [open, initialTitle, initialDesc, reset]);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create'
                            ? txt('create_collection')
                            : txt('edit_collection')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
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
                            {txt('desc_label')}
                        </label>
                        <Input
                            register={register('desc')}
                            error={errors.desc}
                            type="textarea"
                            placeholder={txt('desc_placeholder')}
                            inputStyles="mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info min-h-[80px] resize-y"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            disabled={isSubmitting}
                        >
                            {txt('cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? txt('saving') : txt('confirm')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
