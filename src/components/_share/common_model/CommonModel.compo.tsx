'use client';

import { X } from 'lucide-react';

interface ModalProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal(
    {open, title, children, onClose}: ModalProps)
{

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}