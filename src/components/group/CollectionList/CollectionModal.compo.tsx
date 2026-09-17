'use client';

import { useEffect, useState } from 'react';
import Modal from "@/components/_share/common_model/CommonModel.compo";

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
                    ? 'Create CollectionList'
                    : 'Edit CollectionList'
            }
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Title
                    </label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 outline-none focus:border-border-strong"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Description
                    </label>

                    <textarea
                        value={desc}
                        onChange={(e) =>
                            setDesc(e.target.value)
                        }
                        rows={4}
                        className="w-full resize-none rounded-xl border border-border bg-transparent px-3 py-2.5 outline-none focus:border-border-strong"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background"
                    >
                        {mode === 'create'
                            ? 'Create'
                            : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}