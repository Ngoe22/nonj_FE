'use client';

import { useParams } from 'next/navigation';

export function useExamParams() {
    const params = useParams();
    return {
        locale: String(params?.locale ?? ''),
        collectionId: String(params?.collectionId ?? ''),
        examId: String(params?.examId ?? ''),
    };
}