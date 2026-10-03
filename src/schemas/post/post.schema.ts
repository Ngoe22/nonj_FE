import { z } from 'zod';

import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';

/**
 * Các field "bọc ngoài" của post — DÙNG CHUNG cho:
 *  - soạn thủ công (bước 1)
 *  - lấy từ kho question_preparation
 */
export const postMetaSchema = z.object({
    title: z.string().min(1, 'enter_title').max(50, 'max_char_50'),

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

/**
 * Hạn nộp phải ở TƯƠNG LAI.
 */
export function isDeadlineAcceptable(
    value?: string,
    originalDeadline?: string,
): boolean {
    if (!value) return true; // bỏ hạn = hợp lệ

    const next = new Date(value).getTime();
    if (Number.isNaN(next)) return false;
    if (next > Date.now()) return true; // ở tương lai

    if (!originalDeadline) return false;

    // ở quá khứ: chỉ hợp lệ khi GIỮ NGUYÊN hạn cũ
    return new Date(originalDeadline).getTime() === next;
}

/** Schema cho form, có kèm kiểm tra hạn nộp so với hạn đang lưu */
export function buildPostMetaSchema(originalDeadline?: string) {
    return postMetaSchema.refine(
        (values) => isDeadlineAcceptable(values.deadline_at, originalDeadline),
        { message: 'deadline_must_be_future', path: ['deadline_at'] },
    );
}

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
