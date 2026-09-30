'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight, Layers, SquarePen, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format/date';
import type { QuestionPreparation } from '@/types/question_preparation/question_preparation.type';

interface Props {
    collectionId: string;
    preparation: QuestionPreparation;
    onEdit: () => void;
    onDelete: () => void;
}

export default function PreparationCard({
    collectionId,
    preparation,
    onEdit,
    onDelete,
}: Props) {
    const txt = useTranslations('Question_preparation');
    const sectionCount = preparation.content?.length ?? 0;

    return (
        <Card className="group relative p-5 transition hover:border-border-strong hover:shadow-sm">
            <Link
                href={`/question_preparation/${collectionId}/${preparation.id}`}
            >
                <div className="flex items-center gap-4 pr-20">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {preparation.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            {formatDate(preparation.created_at)}
                            <span className="inline-flex items-center gap-1">
                                <Layers size={11} />
                                {sectionCount} {txt('section_unit')}
                            </span>
                        </p>
                    </div>
                    <ArrowRight
                        size={18}
                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                </div>
            </Link>

            <div className="absolute right-3 top-3 flex gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <SquarePen size={15} />
                </Button>

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash2 size={15} />
                </Button>
            </div>
        </Card>
    );
}
