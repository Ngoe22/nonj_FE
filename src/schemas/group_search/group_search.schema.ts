import { z } from 'zod';

// ============================================================
// Slug — chỉ a-z, 0-9 (KHỚP BE: slug nhóm là `/^[a-zA-Z0-9]+$/`)
//
// Trước đây cho phép thêm `_`, nhưng BE không sinh slug có `_` nên gõ `_` vào
// ô tìm kiếm là chắc chắn không ra kết quả.
// ============================================================
export const slugSearchSchema = z.object({
    keyword: z
        .string()
        .min(1, 'enter_keyword')
        .max(50, 'max_char_50')
        .regex(/^[a-zA-Z0-9]+$/, 'only_letter_and_number'),
});

// ============================================================
// Name — cho phép mọi ký tự, chỉ giới hạn độ dài
// ============================================================
export const nameSearchSchema = z.object({
    keyword: z
        .string()
        .min(1, 'enter_keyword')
        .max(20, 'max_char_20'),
});

// ============================================================
// Type cho form
// ============================================================
export type SlugSearchFormValues = z.infer<typeof slugSearchSchema>;
export type NameSearchFormValues = z.infer<typeof nameSearchSchema>;

export const slugSearchDefaultValues: SlugSearchFormValues = { keyword: '' };
export const nameSearchDefaultValues: NameSearchFormValues = { keyword: '' };