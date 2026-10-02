'use client';

import {useState} from "react";
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
}

export default function ConfirmModal({open, title, description, confirmText, cancelText, onConfirm, onClose}: ConfirmModalProps) {

    const txt = useTranslations('Post_collections')
    // `onConfirm` có thể là async (gọi API) — không chặn thì bấm nhanh 2 lần sẽ
    // gửi 2 request (xoá bộ sưu tập, kick thành viên...).
    const [pending, setPending] = useState(false)

    const handleConfirm = async () => {
        if (pending) return
        const result = onConfirm()
        if (result instanceof Promise) {
            setPending(true)
            try {
                await result
            } finally {
                setPending(false)
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
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover"
                >
                    {cancelText ?? txt('cancel')}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={handleConfirm}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {confirmText ?? txt('confirm')}
                </button>
            </div>
        </Modal>
    );
}