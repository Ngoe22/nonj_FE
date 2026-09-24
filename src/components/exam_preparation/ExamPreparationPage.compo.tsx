'use client';

import { useParams } from 'next/navigation';


// import {
//     examPreparationCollections,
// } from '@/mock/group';


import ExamCollectionCard from "@/components/exam_preparation/ExamCollectionCard.compo";
import {useTranslations} from "next-intl";

export default function ExamPreparationPage() {

    const txt = useTranslations('Exam_preparation')

    const params = useParams();

    const locale = String(params.locale);

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {txt('title')}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    {txt('description')}
                </p>
            </div>

            <div className="mt-6 space-y-3">
                {examPreparationCollections.map(
                    (collection) => (
                        <ExamCollectionCard
                            key={collection.id}
                            locale={locale}
                            collection={collection}
                        />
                    )
                )}
            </div>
        </div>
    );
}