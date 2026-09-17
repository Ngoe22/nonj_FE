'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface ExamCollectionCardProps {
    locale: string;
    collection: {
        id: string;
        title: string;
        desc: string;
    };
}

export default function ExamCollectionCard({
                                               locale,
                                               collection,
                                           }: ExamCollectionCardProps) {
    return (
        <Link
            href={`/${locale}/exam_preparation/${collection.id}`}
        >
            <Card className="group cursor-pointer p-5 transition hover:border-border-strong hover:shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {collection.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {collection.desc}
                        </p>
                    </div>

                    <ArrowRight
                        size={18}
                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                </div>
            </Card>
        </Link>
    );
}