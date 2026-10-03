import { z } from 'zod';

// ============================================================
// Create
// ============================================================
export const createCollectionSchema = z.object({
    title: z
        .string()
        .min(1, 'enter_title')
        .max(50, 'max_char_50'),

    desc: z
        .string()
        .max(50, 'max_char_50')
        .optional()
        .or(z.literal('')),
});

export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

// ============================================================
// Update — cùng shape
// ============================================================
export const updateCollectionSchema = createCollectionSchema;
export type UpdateCollectionFormValues = CreateCollectionFormValues;

// ============================================================
// Default values
// ============================================================
export const collectionDefaultValues: CreateCollectionFormValues = {
    title: '',
    desc: '',
};