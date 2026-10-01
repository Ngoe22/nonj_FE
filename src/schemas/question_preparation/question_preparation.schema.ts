import { z } from 'zod';

import {
    Question_Item_Type,
    Question_Section_Type,
} from '@/enum/question_preparation/question_preparation.enum';

// ============================================================
// Base
// ============================================================

const questionContentSchema = z.object({
    text: z.string().max(1000).optional().or(z.literal('')),
    img_url: z.string().url('invalid_url').optional().or(z.literal('')),
    mp3_url: z.string().url('invalid_url').optional().or(z.literal('')),
});

const baseItemFields = {
    question: z.string().max(500, 'max_char_500'),
    point: z
        .number({ message: 'enter_something' })
        .min(1, 'min_value_1')
        .max(10, 'max_value_10'),
};

// ============================================================
// Item — CHOSE_CORRECT
// ============================================================

const choseCorrectItemSchema = z
    .object({
        type: z.literal(Question_Item_Type.CHOSE_CORRECT),
        ...baseItemFields,
        options: z
            .array(z.string().min(1, 'enter_something'))
            .min(2, 'min_2_options')
            .max(10, 'max_10_options'),
        correct_options: z.array(z.number()).min(1, 'min_1_correct'),
    })
    .refine(
        (data) =>
            data.correct_options.every(
                (index) => index >= 0 && index < data.options.length,
            ),
        { message: 'correct_must_be_in_options', path: ['correct_options'] },
    );

// ============================================================
// Item — ARRANGE
// ============================================================

const arrangeItemSchema = z.object({
    type: z.literal(Question_Item_Type.ARRANGE),
    ...baseItemFields,
    correct: z
        .array(z.string().min(1, 'enter_something'))
        .min(2, 'min_2_words')
        .max(20, 'max_20_words'),
    // KHÔNG bắt người soạn nhập thứ tự hiển thị: họ chỉ nhập THỨ TỰ ĐÚNG,
    // còn thứ tự hiển thị do `shuffleForDisplay` tự xáo lúc lưu.
    shuffled: z.array(z.string()).max(20, 'max_20_words').optional(),
});

// ============================================================
// Item — PAIRING
// ============================================================

const pairingItemSchema = z.object({
    type: z.literal(Question_Item_Type.PAIRING),
    ...baseItemFields,
    pairs: z
        .array(
            z.object({
                key: z.string().min(1, 'enter_something'),
                value: z.string().min(1, 'enter_something'),
            }),
        )
        .min(2, 'min_2_pairs')
        .max(20, 'max_20_pairs'),
});

// ============================================================
// Item — INPUT
// ============================================================

const inputItemSchema = z.object({
    type: z.literal(Question_Item_Type.INPUT),
    ...baseItemFields,
    correct_answers: z
        .array(z.string().min(1, 'enter_something'))
        .min(1, 'min_1_answer')
        .max(10, 'max_10_answers'),
});

export const questionItemSchema = z.discriminatedUnion('type', [
    choseCorrectItemSchema,
    arrangeItemSchema,
    pairingItemSchema,
    inputItemSchema,
]);

// ============================================================
// Section
// ============================================================

const multipleChoiceSectionSchema = z.object({
    type: z.literal(Question_Section_Type.MULTIPLE_CHOICE),
    title: z.string().min(1, 'enter_something').max(50, 'max_char_50'),
    content: questionContentSchema,
    items: z
        .array(questionItemSchema)
        .min(1, 'min_1_item')
        .max(50, 'max_50_items'),
});

const essaySectionSchema = z.object({
    type: z.literal(Question_Section_Type.ESSAY),
    title: z.string().min(1, 'enter_something').max(50, 'max_char_50'),
    content: questionContentSchema,
    point: z
        .number({ message: 'enter_something' })
        .min(1, 'min_value_1')
        .max(100, 'max_value_100'),
    sample_answer: z.string().max(5000).optional().or(z.literal('')),
});

export const questionSectionSchema = z.discriminatedUnion('type', [
    multipleChoiceSectionSchema,
    essaySectionSchema,
]);

// ============================================================
// Toàn bộ đề
// ============================================================

export const questionPreparationSchema = z.object({
    title: z.string().min(1, 'enter_something').max(50, 'max_char_50'),
    sections: z
        .array(questionSectionSchema)
        .min(1, 'min_1_section')
        .max(20, 'max_20_sections'),
});

export type QuestionFormItemValues = z.infer<typeof questionItemSchema>;
export type QuestionFormSectionValues = z.infer<typeof questionSectionSchema>;
export type QuestionPreparationFormValues = z.infer<
    typeof questionPreparationSchema
>;

/** Alias cho phần input của form (dùng cho useForm generic) */
export type QuestionPreparationFormInput = z.input<
    typeof questionPreparationSchema
>;

export const questionPreparationDefaultValues: QuestionPreparationFormInput = {
    title: '',
    sections: [],
};
