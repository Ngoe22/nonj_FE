'use client';

interface Props {
    /** Dòng chính */
    title: string;
    /** Dòng phụ (tuỳ chọn) */
    description?: string;
}

/**
 * Khối "trạng thái rỗng" dùng chung cho các kết quả tìm kiếm:
 * - chưa nhập keyword    → title = no_results
 * - không có nhóm nào    → title = no_groups_found + description = try_another_keyword
 * - danh sách outgoing rỗng → title = no_outgoing_requests
 */
export default function SearchGroupEmpty({ title, description }: Props) {
    return (
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-border">
            <div className="text-center">
                <p className="text-sm font-medium">{title}</p>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
