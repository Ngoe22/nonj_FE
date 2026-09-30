'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import PostList from '@/components/post/list/PostList.compo';
import { useGetGroup } from '@/hooks/group/group_tan.hook';

/** Bộ sưu tập bài tập trong nhóm — danh sách post */
export default function CollectionDetailPage() {
    const params = useParams();
    const groupId = String(params?.groupId ?? '');
    const collectionId = String(params?.collectionId ?? '');

    const txt = useTranslations('Post_collections');

    const { data: group } = useGetGroup(groupId);
    const canCreate = group?.permission?.create_post ?? false;

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-3 border-b border-border pb-5">
                <Link
                    href={`/group/${groupId}`}
                    className="rounded-xl p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                >
                    <ArrowLeft size={19} />
                </Link>

                <h1 className="text-xl font-semibold">{txt('title')}</h1>
            </div>

            <PostList
                groupId={groupId}
                collectionId={collectionId}
                canCreate={canCreate}
            />
        </div>
    );
}
