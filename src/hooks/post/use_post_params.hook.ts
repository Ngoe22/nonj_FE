'use client';

import { useParams } from 'next/navigation';

/** Params của route /group/[groupId]/collection/[collectionId]/post/[postId] */
export function usePostParams() {
    const params = useParams();
    return {
        locale: String(params?.locale ?? ''),
        groupId: String(params?.groupId ?? ''),
        collectionId: String(params?.collectionId ?? ''),
        postId: String(params?.postId ?? ''),
    };
}
