'use client';

import { useParams } from 'next/navigation';

/** Đọc params của route /question_preparation/[collectionId]/[preparationId] */
export function usePreparationParams() {
    const params = useParams();
    return {
        locale: String(params?.locale ?? ''),
        collectionId: String(params?.collectionId ?? ''),
        preparationId: String(params?.preparationId ?? ''),
    };
}
