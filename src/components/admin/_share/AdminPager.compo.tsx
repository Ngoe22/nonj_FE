'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    page: number;
    count: number;
    pageSize?: number;
    onPage: (page: number) => void;
}

export function AdminPager({ page, count, pageSize = 20, onPage }: Props) {
    const txt = useTranslations('Admin');

    return (
        <div className="flex items-center justify-between pt-4 text-sm">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPage(page - 1)}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 hover:bg-surface-hover disabled:opacity-40"
            >
                <ChevronLeft size={14} />
                {txt('prev')}
            </button>

            <span className="text-muted-foreground">
                {txt('page')} {page}
            </span>

            <button
                type="button"
                disabled={count < pageSize}
                onClick={() => onPage(page + 1)}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 hover:bg-surface-hover disabled:opacity-40"
            >
                {txt('next')}
                <ChevronRight size={14} />
            </button>
        </div>
    );
}

/** Khung danh sách + trạng thái loading/rỗng dùng chung cho các tab */
export function AdminListShell({
    isLoading,
    isEmpty,
    emptyText,
    children,
}: {
    isLoading: boolean;
    isEmpty: boolean;
    emptyText: string;
    children: React.ReactNode;
}) {
    const txt = useTranslations('Admin');

    if (isLoading) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                {txt('loading')}
            </p>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">{emptyText}</p>
            </div>
        );
    }

    return <div className="space-y-2">{children}</div>;
}
