'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {useInfiniteScroll} from "@/hooks/_share/infinityScroll/infinityScroll.hook";

interface Props<T> {
    /** Mảng đã flatten từ data.pages */
    items: T[];
    /** Hàm render từng item */
    renderItem: (item: T, index: number) => ReactNode;
    /** Key cho từng item */
    getKey: (item: T, index: number) => string | number;
    /** Trạng thái từ useInfiniteQuery */
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    /** Trạng thái loading ban đầu */
    isLoading?: boolean;
    isError?: boolean;
    /** UI tuỳ chỉnh */
    loadingComponent?: ReactNode;
    errorComponent?: ReactNode;
    emptyComponent?: ReactNode;
    endComponent?: ReactNode;
    /** Wrapper class */
    className?: string;
    itemClassName?: string;
}

export function InfiniteScrollList<T>({
                  items,
                  renderItem,
                  getKey,
                  hasNextPage,
                  isFetchingNextPage,
                  fetchNextPage,
                  isLoading = false,
                  isError = false,
                  loadingComponent,
                  errorComponent,
                  emptyComponent,
                  endComponent,
                  className = 'space-y-4',
                  itemClassName,
    }: Props<T>) {

    const sentinelRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    // 1. Loading lần đầu
    if (isLoading) {
        return (
            <>
                {loadingComponent ?? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                )}
            </>
        );
    }

    // 2. Lỗi
    if (isError) {
        return (
            <>
                {errorComponent ?? (
                    <p className="py-6 text-center text-sm text-red-500">
                        Đã xảy ra lỗi khi tải dữ liệu
                    </p>
                )}
            </>
        );
    }

    // 3. Rỗng
    if (items.length === 0) {
        return (
            <>
                {emptyComponent ?? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        Không có dữ liệu
                    </p>
                )}
            </>
        );
    }

    // 4. Có data
    return (
        <div className={className}>
            {items.map((item, index) => (
                <div key={getKey(item, index)} className={itemClassName}>
                    {renderItem(item, index)}
                </div>
            ))}

            {/* Sentinel — khi vào viewport thì fetchNextPage */}
            <div ref={sentinelRef} className="h-1" />

            {/* Loading indicator khi đang load thêm */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-muted-foreground" size={20} />
                </div>
            )}

            {/* Hết trang */}
            {!hasNextPage && !isFetchingNextPage && (
                <>
                    {endComponent ?? (
                        <p className="py-4 text-center text-xs text-muted-foreground">
                            — Đã hết —
                        </p>
                    )}
                </>
            )}
        </div>
    );
}