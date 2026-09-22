import { useEffect, useRef } from 'react';

interface Options {
    /** Còn trang để load không */
    hasNextPage: boolean | undefined;
    /** Đang fetch trang tiếp không */
    isFetchingNextPage: boolean;
    /** Hàm load trang tiếp */
    fetchNextPage: () => void;
    /** Khoảng cách trước khi chạm đáy (px), mặc định 300 */
    rootMargin?: string;
}

export function useInfiniteScroll({
                                      hasNextPage,
                                      isFetchingNextPage,
                                      fetchNextPage,
                                      rootMargin = '300px',
                                  }: Options) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) fetchNextPage();
            },
            { rootMargin },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

    return sentinelRef;
}