'use client';

import { useParams } from 'next/navigation';


import {
    examPreparationCollections,
} from '@/mock/group';
import ExamCollectionCard from "@/components/exam_preparation/ExamCollectionCard.compo";

export default function ExamPreparationPage() {
    const params = useParams();

    const locale = String(params.locale);

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Exam Preparation
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Your exam preparation collections.
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