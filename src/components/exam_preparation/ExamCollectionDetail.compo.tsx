'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Card } from '@/components/ui/card';

import {
    examPreparationCollections,
    examPreparationList,
} from '@/mock/group';
import {useTranslations} from "next-intl";

export default function ExamCollectionDetail() {

    const txt = useTranslations('Exam_preparation')
    const params = useParams();
    const locale = String(params.locale);
    const collectionId = String(
        params.collectionId
    );

    const collection =
        examPreparationCollections.find(
            (item) => item.id === collectionId
        );

    if (!collection) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
                <p className="text-sm text-muted-foreground">
                    Collection not found.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="border-b border-border pb-5">
                <Link
                    href={`/${locale}/exam_preparation`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    {txt('back')}
                </Link>

                <h1 className="mt-4 text-2xl font-bold">
                    {collection.title}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    {collection.desc}
                </p>
            </div>

            {/* Exam list */}
            <section className="mt-6">
                <h2 className="text-lg font-semibold">
                    {txt('exams')}
                </h2>

                <div className="mt-4 space-y-3">
                    {examPreparationList.map(
                        (exam) => (
                            <Link
                                key={exam.id}
                                href={`/${locale}/exam_preparation/${collectionId}/${exam.id}`}
                            >
                                <Card className="group cursor-pointer p-5 transition hover:border-border-strong hover:shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-medium">
                                                {exam.title}
                                            </h3>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {exam.collection
                                                    .name}
                                            </p>
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </Card>
                            </Link>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}