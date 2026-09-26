import { z } from 'zod';

// ============================================================
// Collection
// ============================================================
export const collectionFormSchema = z.object({
    title: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50'),

    desc: z
        .string()
        .max(50, 'max_char_50')
        .optional()
        .or(z.literal('')),
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export const collectionDefaultValues: CollectionFormValues = {
    title: '',
    desc: '',
};

// ============================================================
// Template
// ============================================================
export const templateFormSchema = z.object({
    title: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50'),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const templateDefaultValues: TemplateFormValues = {
    title: '',
};