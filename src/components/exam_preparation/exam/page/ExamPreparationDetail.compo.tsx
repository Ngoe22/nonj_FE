'use client';

import {Link} from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format/date';
import { api } from '@/lib/axios/axios';
import type { ExamTemplate } from '@/types/exam_preparation/exam_preparation.type';
import {useExamParams} from "@/hooks/exam_preparation/use_exam_params.hook";
import {useGetMyTemplate, useUpdateTemplate} from "@/hooks/exam_preparation/exam_preparation.hook";
import {useState} from "react";

export default function ExamPreparationDetail() {

    const txt = useTranslations('Exam_preparation');
    const { collectionId, examId } = useExamParams();

    const { data: preparation, isLoading } = useGetMyTemplate( { collectionId ,preparationId : examId } )
    const updateMutation = useUpdateTemplate();

    const currentTemplate =  useState(preparation);


    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <p className="text-sm text-muted-foreground">{txt('loading')}</p>
            </div>
        );
    }
    if (!preparation) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <p className="text-sm text-muted-foreground">
                    {txt('template_not_found')}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="border-b border-border pb-5">
                <Link
                    href={`/exam_preparation/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <h1 className="mt-5 text-2xl font-bold">{preparation.title}</h1>

                <div className="mt-3 flex items-center gap-3">
                    <Badge variant="secondary">
                        {formatDate(preparation.created_at)}
                    </Badge>
                </div>

                <div className="mt-3 flex items-center gap-3">
                    <Badge variant="secondary">
                        {preparation.question_type}
                    </Badge>
                </div>


            </div>

            {/* Exercise content */}
            <section className="mt-8">
                <h2 className="text-lg font-semibold">{txt('exercise_content')}</h2>

                <div className="mt-4 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
                    <div className="text-center">
                        <p className="mt-1 text-sm text-muted-foreground">
                            // preparation.preparation_content

                            if type = mul

                            /Render A
                                content
                                answer

                            Render B

                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}