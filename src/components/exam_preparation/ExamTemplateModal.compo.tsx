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
    templateFormSchema,
    templateDefaultValues,
    type TemplateFormValues,
} from '@/schemas/exam_preparation/exam_preparation.schema';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    onClose: () => void;
    onSubmit: (data: TemplateFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export default function ExamTemplateModal({
                                              open,
                                              mode,
                                              initialTitle = '',
                                              onClose,
                                              onSubmit,
                                              isSubmitting = false,
                                          }: Props) {
    const txt = useTranslations('Exam_preparation');
    const txtErr = useTranslations('Shema');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TemplateFormValues>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: { title: initialTitle },
        mode: 'onSubmit',
    });

    useEffect(() => {
        if (open) reset({ title: initialTitle });
    }, [open, initialTitle, reset]);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create'
                            ? txt('create_template')
                            : txt('edit_template')}
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

                    {/* Chỗ này sau này thêm UI edit exercise_content */}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
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