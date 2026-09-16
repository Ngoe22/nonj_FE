'use client';

import { ArrowLeft } from 'lucide-react';

interface GroupSubHeaderProps {
    title: string;
    onBack: () => void;
}

export default function GroupSubHeader({
                                           title,
                                           onBack,
                                       }: GroupSubHeaderProps) {
    return (
        <div className="flex items-center gap-3 border-b border-border pb-5">
            <button
                type="button"
                onClick={onBack}
                className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-foreground"
            >
                <ArrowLeft size={19} />
            </button>

            <h2 className="text-xl font-semibold">
                {title}
            </h2>
        </div>
    );
}