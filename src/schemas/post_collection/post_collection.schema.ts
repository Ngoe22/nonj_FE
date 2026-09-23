import { z } from 'zod';

// ============ Create / Update — title + desc ============
export const createCollectionSchema = z.object({
    title: z
        .string()
        .min(1, 'enter_something')
        .min(3, 'at_least_char_3')
        .max(50, 'max_char_50'),

    desc: z
        .string()
        .max(500, 'max_char_500')
        .optional()
        .or(z.literal('')),
});

export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = createCollectionSchema;
export type UpdateCollectionFormValues = CreateCollectionFormValues;

export const collectionDefaultValues: CreateCollectionFormValues = {
    title: '',
    desc: '',
};