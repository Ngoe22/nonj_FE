'use client';

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { View_Each_Other_Answer } from '@/enum/post/post.enum';

/**
 * Badge "nhãn + giá trị" cho hàng thông tin của bài tập.
 *
 * Dùng CHUNG cho PostCard (danh sách) và PostDetail để hai chỗ hiển thị giống
 * nhau. Trước đây chỉ có icon + giá trị trơ trọi, nên "Không giới hạn" (hạn nộp)
 * đứng cạnh "Cho làm lại" (chế độ làm lại) đọc rất khó hiểu — không biết cái nào
 * thuộc cái nào.
 */
export function PostInfoBadge({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
}) {
    return (
        <Badge variant="secondary" className="gap-1.5 font-normal">
            {icon}
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value}</span>
        </Badge>
    );
}

/** Nhãn hiển thị của chế độ "xem bài nhau" — dùng chung cho card + detail */
export function viewEachOtherLabel(
    t: (key: string) => string,
    value: View_Each_Other_Answer,
): string {
    if (value === View_Each_Other_Answer.NEVER) return t('view_never');
    if (value === View_Each_Other_Answer.AFTER_ANSWER) return t('view_after_answer');
    return t('view_after_deadline');
}
