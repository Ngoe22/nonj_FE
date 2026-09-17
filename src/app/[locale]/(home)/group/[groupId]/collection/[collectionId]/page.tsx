'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

import { testGroupCollectionData } from '@/mock/group';

export default function CollectionDetailPage() {
    const params = useParams();

    const locale = String(params.locale);
    const groupId = String(params.groupId);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-3 border-b border-border pb-5">
                <Link
                    href={`/${locale}/group/${groupId}`}
                    className="rounded-xl p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                    <ArrowLeft size={19} />
                </Link>

                <h1 className="text-xl font-semibold">
                    {testGroupCollectionData.title}
                </h1>
            </div>

            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <h2 className="font-medium">
                        No posts yet
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Posts in this collection will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
}