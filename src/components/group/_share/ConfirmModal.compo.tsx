'use client';

import {useState} from "react";
import {Loader2} from "lucide-react";
import Modal from "@/components/_share/common_modal/CommonModal.compo";
import {useTranslations} from "next-intl";


interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
    /**
     * Đang xử lý — truyền `isPending` của mutation vào.
     *
     * Modal cũng tự theo dõi promise của `onConfirm`, NHƯNG nếu `onConfirm`
     * không trả về Promise (fire-and-forget) thì state nội bộ vô tác dụng.
     * Prop này để chắc chắn nút bị khoá và có spinner.
     */
    pending?: boolean;
}

export default function ConfirmModal({open, title, description, confirmText, cancelText, onConfirm, onClose, pending: pendingProp = false}: ConfirmModalProps) {

    const txt = useTranslations('Post_collections')
    // `onConfirm` có thể là async (gọi API) — không chặn thì bấm nhanh 2 lần sẽ
    // gửi 2 request (xoá bộ sưu tập, kick thành viên...).
    const [busy, setBusy] = useState(false)
    const pending = pendingProp || busy

    const handleConfirm = async () => {
        if (pending) return
        const result = onConfirm()
        if (result instanceof Promise) {
            setBusy(true)
            try {
                await result
            } finally {
                setBusy(false)
            }
        }
    }

    return (
        <Modal
            open={open}
            title={title}
            onClose={onClose}
        >
            <p className="text-sm leading-6 text-muted-foreground">
                {description}
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={pending}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {cancelText ?? txt('cancel')}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={handleConfirm}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending && <Loader2 size={14} className="animate-spin" />}
                    {confirmText ?? txt('confirm')}
                </button>
            </div>
        </Modal>
    );
}