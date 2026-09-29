'use client';

import {useEffect, useState} from 'react';
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
import {AnswerContent, ExerciseContent} from "@/types/exam_preparation/exam_preparation.type";
import {Question_Type} from "@/enum/post/post.enum";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TemplateFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export default function ExamPreparationCreateModal({
                                              open,
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
        defaultValues: { title: '' },
        mode: 'onSubmit',
    });


    const type = useState<Question_Type>(Question_Type.MULTIPLE_CHOICE)
    const preparation_content = useState<ExerciseContent>( [] )
    const correct_answers = useState<AnswerContent>([])


    useEffect(() => {
        if (open) reset({ title: '' });
    }, [open, reset]);

    const submit = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-10/12">
                <DialogHeader>
                    <DialogTitle>
                        { txt('create_template')}
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
                    {/*   */}
                    drop down to chose type

                    {/* Chỗ này sau này thêm UI edit exercise_content */}

                    4 btn for 4 type

                    title



                    {/* ========================= */}
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