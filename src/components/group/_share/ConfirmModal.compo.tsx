'use client';

import Modal from "@/components/_share/common_modal/CommonModal.compo";
import {useTranslations} from "next-intl";


interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmModal({open, title, description, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onClose}: ConfirmModalProps) {

    const txt = useTranslations('Post_collections')

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
                    {txt('cancel')}
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    {txt('confirm')}
                </button>
            </div>
        </Modal>
    );
}