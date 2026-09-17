'use client';

import Link from 'next/link';
import {
    ArrowLeft,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { ExamPreparation } from '@/mock/group';

interface ExamPreparationDetailProps {
    locale: string;
    collectionId: string;
}

export default function ExamPreparationDetail({
                                                  locale,
                                                  collectionId,
                                              }: ExamPreparationDetailProps) {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
            {/* Header */}
            <div className="border-b border-border pb-5">
                <Link
                    href={`/${locale}/exam_preparation/${collectionId}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft size={17} />
                    Back
                </Link>

                <h1 className="mt-5 text-2xl font-bold">
                    {ExamPreparation.title}
                </h1>

                <div className="mt-3">
                    <Badge variant="secondary">
                        {ExamPreparation.collection.name}
                    </Badge>
                </div>
            </div>

            {/* Basic information */}
            <section className="mt-6">
                <h2 className="text-lg font-semibold">
                    Information
                </h2>

                <div className="mt-4 rounded-2xl border border-border bg-card p-5">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Title
                        </p>

                        <p className="mt-1 text-sm font-medium">
                            {ExamPreparation.title}
                        </p>
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Collection
                        </p>

                        <p className="mt-1 text-sm font-medium">
                            {ExamPreparation.collection.name}
                        </p>
                    </div>
                </div>
            </section>

            {/* Exercise content */}
            <section className="mt-8">
                <h2 className="text-lg font-semibold">
                    Exercise content
                </h2>

                <div className="mt-4 flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border">
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            Exercise content
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            This section will be implemented later.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}