'use client';

import {Link} from '@/i18n/navigation';
import {ArrowRight, MoreVertical, SquarePen, Trash} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ExamCollection } from '@/types/exam_preparation/exam_preparation.type';

interface Props {
    collection: ExamCollection;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ExamCollectionCard({
                                               collection,
                                               onEdit,
                                               onDelete,
                                           }: Props) {
    return (
        <Card className="group relative p-5 transition hover:border-border-strong hover:shadow-sm">
            <Link href={`/exam_preparation/${collection.id}`}>
                <div className="flex items-center gap-4 pr-10">
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
                    {/*<ArrowRight*/}
                    {/*    size={18}*/}
                    {/*    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"*/}
                    {/*/>*/}
                </div>
            </Link>

            {/* Actions */}
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
                    {/*<span className="sr-only">Edit</span>*/}
                    <SquarePen/>
                    {/*<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
                    {/*    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />*/}
                    {/*    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />*/}
                    {/*</svg>*/}
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
                    {/*<span className="sr-only">Delete</span>*/}
                    <Trash/>
                    {/*<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
                    {/*    <polyline points="3 6 5 6 21 6" />*/}
                    {/*    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />*/}
                    {/*    <path d="M10 11v6M14 11v6" />*/}
                    {/*    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />*/}
                    {/*</svg>*/}
                </Button>
            </div>
        </Card>
    );
}