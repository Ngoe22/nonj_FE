'use client';

import { useEffect, useState } from 'react';
import Modal from "@/components/_share/common_model/CommonModel.compo";
import {useTranslations} from "next-intl";

interface CollectionModalProps {
    open: boolean;
    mode: 'create' | 'edit';
    initialTitle?: string;
    initialDesc?: string;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        desc: string;
    }) => void;
}

export default function CollectionModal({
                                            open,
                                            mode,
                                            initialTitle = '',
                                            initialDesc = '',
                                            onClose,
                                            onSubmit,
                                        }: CollectionModalProps) {

    const  txt = useTranslations('Post_collections')

    const [title, setTitle] = useState(initialTitle);
    const [desc, setDesc] = useState(initialDesc);

    useEffect(() => {
        setTitle(initialTitle);
        setDesc(initialDesc);
    }, [initialTitle, initialDesc, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            title,
            desc,
        });
    };

    return (
        <Modal
            open={open}
            title={
                mode === 'create'
                    ? txt('modal_title_create')
                    : txt('modal_title_edit')
            }
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        {txt('title_label')}
                    </label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        {txt('description')}
                    </label>

                    <textarea
                        value={desc}
                        onChange={(e) =>
                            setDesc(e.target.value)
                        }
                        rows={4}
                        className="w-full resize-none rounded-xl border border-border bg-transparent px-3 py-2.5 outline-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover"
                    >
                        {txt('cancel')}
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background"
                    >
                        {txt('confirm')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}