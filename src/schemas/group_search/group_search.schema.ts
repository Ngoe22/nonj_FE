import { z } from 'zod';

// ============================================================
// Slug — chỉ a-z, 0-9, _
// ============================================================
export const slugSearchSchema = z.object({
    keyword: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50')
        .regex(/^[a-zA-Z0-9_]+$/, 'only_letter_and_number_and_underscore'),
});

// ============================================================
// Name — cho phép mọi ký tự, chỉ giới hạn độ dài
// ============================================================
export const nameSearchSchema = z.object({
    keyword: z
        .string()
        .min(1, 'enter_something')
        .max(20, 'max_char_20'),
});

// ============================================================
// Type cho form
// ============================================================
export type SlugSearchFormValues = z.infer<typeof slugSearchSchema>;
export type NameSearchFormValues = z.infer<typeof nameSearchSchema>;

export const slugSearchDefaultValues: SlugSearchFormValues = { keyword: '' };
export const nameSearchDefaultValues: NameSearchFormValues = { keyword: '' };