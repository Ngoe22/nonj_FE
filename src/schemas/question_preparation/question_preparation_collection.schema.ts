import { z } from 'zod';

// ============================================================
// Thư mục đề cá nhân
// ============================================================
export const collectionFormSchema = z.object({
    title: z.string().min(1, 'enter_something').max(50, 'max_char_50'),

    desc: z.string().max(100, 'max_char_100').optional().or(z.literal('')),
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export const collectionDefaultValues: CollectionFormValues = {
    title: '',
    desc: '',
};
