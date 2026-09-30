'use client';

import { Link } from '@/i18n/navigation';
import { SquarePen, Trash } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { QuestionPreparationCollection } from '@/types/question_preparation/question_preparation.type';

interface Props {
    collection: QuestionPreparationCollection;
    onEdit: () => void;
    onDelete: () => void;
}

export default function PreparationCollectionCard({
    collection,
    onEdit,
    onDelete,
}: Props) {
    return (
        <Card className="group relative p-5 transition hover:border-border-strong hover:shadow-sm">
            <Link href={`/question_preparation/${collection.id}`}>
                <div className="flex items-center gap-4 pr-20">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {collection.title}
                        </h3>
                        {collection.desc && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {collection.desc}
                            </p>
                        )}
                    </div>
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
                    <Trash size={15} />
                </Button>
            </div>
        </Card>
    );
}
