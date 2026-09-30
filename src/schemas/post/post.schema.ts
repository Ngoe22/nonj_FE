import { z } from 'zod';

import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';

/**
 * Các field "bọc ngoài" của post — DÙNG CHUNG cho:
 *  - soạn thủ công (bước 1)
 *  - lấy từ kho question_preparation
 *  - sửa post (nội dung câu hỏi bị khoá, xem UpdatePostDto ở BE)
 */
export const postMetaSchema = z.object({
    title: z.string().min(1, 'enter_something').max(50, 'max_char_50'),

    description: z
        .string()
        .max(500, 'max_char_500')
        .optional()
        .or(z.literal('')),

    /** chuỗi của input `datetime-local`, rỗng = không giới hạn */
    deadline_at: z.string().optional().or(z.literal('')),

    retake: z.enum([Retake.BEFORE_DATELINE, Retake.NEVER]),

    view_each_other_answer: z.enum([
        View_Each_Other_Answer.NEVER,
        View_Each_Other_Answer.AFTER_ANSWER,
        View_Each_Other_Answer.AFTER_DEADLINE,
    ]),
});

export type PostMetaFormValues = z.infer<typeof postMetaSchema>;

export const postMetaDefaultValues: PostMetaFormValues = {
    title: '',
    description: '',
    deadline_at: '',
    retake: Retake.NEVER,
    view_each_other_answer: View_Each_Other_Answer.NEVER,
};

/** `datetime-local` -> ISO cho BE; rỗng -> null */
export function toDeadlineIso(value: string | undefined): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}
