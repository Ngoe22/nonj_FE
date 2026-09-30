'use client';

import { Pencil, FolderOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    open: boolean;
    onClose: () => void;
    onManual: () => void;
    onFromPreparation: () => void;
}

export default function CreatePostChoiceModal({
    open,
    onClose,
    onManual,
    onFromPreparation,
}: Props) {
    const txt = useTranslations('Post');

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{txt('create_post')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3">
                    <button
                        type="button"
                        onClick={onManual}
                        className="flex items-start gap-3 rounded-2xl border-2 border-border p-4 text-left transition hover:border-foreground/40 hover:bg-surface-hover"
                    >
                        <Pencil size={18} className="mt-0.5 shrink-0" />
                        <span>
                            <span className="block text-sm font-semibold">
                                {txt('create_manually')}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                {txt('create_manually_desc')}
                            </span>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onFromPreparation}
                        className="flex items-start gap-3 rounded-2xl border-2 border-border p-4 text-left transition hover:border-foreground/40 hover:bg-surface-hover"
                    >
                        <FolderOpen size={18} className="mt-0.5 shrink-0" />
                        <span>
                            <span className="block text-sm font-semibold">
                                {txt('create_from_preparation')}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                {txt('create_from_preparation_desc')}
                            </span>
                        </span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
