import { Ban, Loader2, SaveCheck, SquarePen } from 'lucide-react';

interface Props {
    isEditing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    onEdit: () => void;
    /**
     * Đang gửi request.
     *
     * BẮT BUỘC truyền vào ở mọi chỗ dùng. Nếu không: nút Lưu vẫn bấm được nhiều
     * lần (gửi nhiều request), và người dùng không thấy app đang chạy nên tưởng lag.
     */
    pending?: boolean;
}

const BTN =
    'flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

export function ActionBtnGroup({
    isEditing,
    onConfirm,
    onCancel,
    onEdit,
    pending = false,
}: Props) {
    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={onEdit}
                disabled={pending}
                className={BTN}
                aria-label="Sửa"
                title="Sửa"
            >
                <SquarePen />
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className={BTN}
                aria-label="Lưu"
                title="Lưu"
            >
                {/* Đang lưu -> spinner thay icon, để thấy app đang chạy */}
                {pending ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <SaveCheck />
                )}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className={BTN}
                aria-label="Huỷ"
                title="Huỷ"
            >
                <Ban />
            </button>
        </div>
    );
}
