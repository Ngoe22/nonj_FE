import { z } from 'zod';

// ============================================================
// Search user — username chỉ a-z, A-Z, 0-9, _
// (BE: user_name varchar(50), unique)
// ============================================================
export const friendSearchSchema = z.object({
    keyword: z
        .string()
        .min(1, 'enter_keyword')
        .max(50, 'max_char_50')
        .regex(/^[a-zA-Z0-9_]+$/, 'only_letter_and_number_and_underscore'),
});

// ============================================================
// Type cho form
// ============================================================
export type FriendSearchFormValues = z.infer<typeof friendSearchSchema>;

export const friendSearchDefaultValues: FriendSearchFormValues = { keyword: '' };
