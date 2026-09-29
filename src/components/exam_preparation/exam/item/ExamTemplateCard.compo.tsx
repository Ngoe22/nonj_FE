'use client';

import {Link} from '@/i18n/navigation';
import { ArrowRight, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format/date';
import type { ExamTemplate } from '@/types/exam_preparation/exam_preparation.type';

interface Props {
    collectionId: string;
    template: ExamTemplate;
    onDelete: () => void;
}

export default function ExamTemplateCard({
                                             collectionId,
                                             template,
                                             onDelete,
                                         }: Props) {
    return (
        <Card className="group relative p-5 transition hover:border-border-strong hover:shadow-sm">
            <Link href={`/exam_preparation/${collectionId}/${template.id}`}>
                <div className="flex items-center gap-4 pr-10">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-foreground">
                            {template.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(template.created_at)}
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