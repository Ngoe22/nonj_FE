import {
    Question_Item_Type,
    Question_Section_Type,
} from '@/enum/question_preparation/question_preparation.enum';

// ============================================================
// NỘI DUNG ĐỀ BÀI (dùng chung cho mọi loại section)
// ============================================================

export interface QuestionContent {
    text?: string;
    img_url?: string;
    mp3_url?: string;
}

/** Một lựa chọn / một cặp nối trong item PAIRING */
export interface PairingPair {
    key: string;
    value: string;
}

// ============================================================
// ITEM — PHẦN NỘI DUNG (KHÔNG có đáp án)
// Đáp án nằm ở `correct_answer`, song song theo [sectionIndex][itemIndex]
// ============================================================

interface BaseContentItem {
    /** Câu hỏi riêng của item */
    question: string;
    /** Điểm cho item này */
    point: number;
}

/** CHOSE_CORRECT — chỉ có danh sách lựa chọn, đáp án nằm bên correct_answer */
export interface ChoseCorrectContentItem extends BaseContentItem {
    type: Question_Item_Type.CHOSE_CORRECT;
    options: string[];
}

/** ARRANGE — chỉ có thứ tự hiển thị đã xáo; thứ tự ĐÚNG nằm ở correct_answer */
export interface ArrangeContentItem extends BaseContentItem {
    type: Question_Item_Type.ARRANGE;
    shuffled: string[];
}

/** PAIRING — 2 cột tách rời; cặp nối đúng nằm ở correct_answer */
export interface PairingContentItem extends BaseContentItem {
    type: Question_Item_Type.PAIRING;
    keys: string[];
    values: string[];
}

/** INPUT — không có gì để hiển thị ngoài câu hỏi */
export interface InputContentItem extends BaseContentItem {
    type: Question_Item_Type.INPUT;
}

export type QuestionContentItem =
    | ChoseCorrectContentItem
    | ArrangeContentItem
    | PairingContentItem
    | InputContentItem;

// ============================================================
// SECTION — PHẦN NỘI DUNG
// ============================================================

export interface MultipleChoiceContentSection {
    type: Question_Section_Type.MULTIPLE_CHOICE;
    title: string;
    content: QuestionContent;
    /** null = không giới hạn thời gian */
    time_limit: number | null;
    items: QuestionContentItem[];
}

export interface EssayContentSection {
    type: Question_Section_Type.ESSAY;
    title: string;
    content: QuestionContent;
    time_limit: number | null;
    /** Điểm tối đa cho cả bài luận */
    point: number;
}

export type QuestionContentSection =
    | MultipleChoiceContentSection
    | EssayContentSection;

// ============================================================
// ĐÁP ÁN — song song với content
// ============================================================

export interface ChoseCorrectAnswerItem {
    type: Question_Item_Type.CHOSE_CORRECT;
    /** index trong `options` được coi là đúng */
    correct_options: number[];
}

export interface ArrangeAnswerItem {
    type: Question_Item_Type.ARRANGE;
    /** thứ tự đúng */
    correct: string[];
}

export interface PairingAnswerItem {
    type: Question_Item_Type.PAIRING;
    pairs: PairingPair[];
}

export interface InputAnswerItem {
    type: Question_Item_Type.INPUT;
    /** nhiều đáp án được chấp nhận */
    correct_answers: string[];
}

export type QuestionAnswerItem =
    | ChoseCorrectAnswerItem
    | ArrangeAnswerItem
    | PairingAnswerItem
    | InputAnswerItem;

export interface MultipleChoiceAnswerSection {
    type: Question_Section_Type.MULTIPLE_CHOICE;
    items: QuestionAnswerItem[];
}

export interface EssayAnswerSection {
    type: Question_Section_Type.ESSAY;
    sample_answer?: string;
}

export type QuestionAnswerSection =
    | MultipleChoiceAnswerSection
    | EssayAnswerSection;

// ============================================================
// FORM — dạng builder giữ, ĐÁP ÁN NHÚNG TRONG ITEM
// ============================================================

interface BaseFormItem {
    question: string;
    point: number;
}

export interface ChoseCorrectFormItem extends BaseFormItem {
    type: Question_Item_Type.CHOSE_CORRECT;
    options: string[];
    correct_options: number[];
}

export interface ArrangeFormItem extends BaseFormItem {
    type: Question_Item_Type.ARRANGE;
    /**
     * Người soạn chỉ nhập THỨ TỰ ĐÚNG. Thứ tự hiển thị cho học viên do
     * `shuffleForDisplay` sinh ra lúc dựng content — không nằm trong form.
     */
    correct: string[];
}

export interface PairingFormItem extends BaseFormItem {
    type: Question_Item_Type.PAIRING;
    pairs: PairingPair[];
}

export interface InputFormItem extends BaseFormItem {
    type: Question_Item_Type.INPUT;
    correct_answers: string[];
}

export type QuestionFormItem =
    | ChoseCorrectFormItem
    | ArrangeFormItem
    | PairingFormItem
    | InputFormItem;

export interface MultipleChoiceFormSection {
    type: Question_Section_Type.MULTIPLE_CHOICE;
    title: string;
    content: QuestionContent;
    items: QuestionFormItem[];
}

export interface EssayFormSection {
    type: Question_Section_Type.ESSAY;
    title: string;
    content: QuestionContent;
    point: number;
    sample_answer?: string;
}

export type QuestionFormSection =
    | MultipleChoiceFormSection
    | EssayFormSection;

/** Toàn bộ form tạo/sửa một đề */
export interface QuestionPreparationForm {
    title: string;
    sections: QuestionFormSection[];
}

// ============================================================
// ENTITY TRẢ VỀ TỪ API
// ============================================================

export interface QuestionPreparation {
    id: string;
    title: string;
    content: QuestionContentSection[];
    /** null khi đề không có đáp án cố định */
    correct_answer: QuestionAnswerSection[] | null;
    created_at: string;
    user?: {
        id: string;
        user_name?: string;
        nickname?: string;
        avatar_url?: string | null;
    };
    collection?: {
        id: string;
        title: string;
    };
}

export interface QuestionPreparationCollection {
    id: string;
    title: string;
    desc?: string | null;
    created_at: string;
}

// ============================================================
// VARS CHO CÁC HOOK MUTATION
// ============================================================

export interface CreatePreparationVars {
    title: string;
    collection: string;
    content: QuestionContentSection[];
    correct_answer: QuestionAnswerSection[];
}

export interface UpdatePreparationVars {
    collection_id: string;
    preparation_id: string;
    body: {
        title?: string;
        content?: QuestionContentSection[];
        correct_answer?: QuestionAnswerSection[];
    };
}

export interface CreateCollectionVars {
    title: string;
    desc?: string;
}

export interface UpdateCollectionVars {
    id: string;
    body: { title?: string; desc?: string };
}

// ============================================================
// FACTORY — giá trị mặc định khi thêm section / item
// ============================================================

export function createEmptySection(
    type: Question_Section_Type,
): QuestionFormSection {
    if (type === Question_Section_Type.MULTIPLE_CHOICE) {
        return {
            type: Question_Section_Type.MULTIPLE_CHOICE,
            title: '',
            content: { text: '' },
            items: [],
        };
    }
    return {
        type: Question_Section_Type.ESSAY,
        title: '',
        content: { text: '' },
        point: 10,
        sample_answer: '',
    };
}

export function createEmptyItem(type: Question_Item_Type): QuestionFormItem {
    const base = { question: '', point: 1 };

    switch (type) {
        case Question_Item_Type.CHOSE_CORRECT:
            return {
                ...base,
                type: Question_Item_Type.CHOSE_CORRECT,
                options: ['', ''],
                correct_options: [],
            };
        case Question_Item_Type.ARRANGE:
            return {
                ...base,
                type: Question_Item_Type.ARRANGE,
                correct: ['', ''],
            };
        case Question_Item_Type.PAIRING:
            return {
                ...base,
                type: Question_Item_Type.PAIRING,
                pairs: [
                    { key: '', value: '' },
                    { key: '', value: '' },
                ],
            };
        case Question_Item_Type.INPUT:
            return {
                ...base,
                type: Question_Item_Type.INPUT,
                correct_answers: [''],
            };
    }
}

/**
 * Xáo thứ tự hiển thị cho câu dạng "sắp xếp".
 *
 * Người soạn chỉ nhập THỨ TỰ ĐÚNG; hệ thống tự xáo để học viên phải sắp lại.
 * Nếu xáo ra trùng đúng thứ tự gốc thì xáo lại — đề hiển thị y hệt đáp án là
 * đề vô nghĩa.
 */
export function shuffleForDisplay(correct: string[]): string[] {
    if (correct.length < 2) return [...correct];

    for (let attempt = 0; attempt < 10; attempt++) {
        const shuffled = [...correct];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled.some((value, index) => value !== correct[index])) {
            return shuffled;
        }
    }

    // Mọi phần tử giống nhau (hoặc quá xui) -> đảo ngược để chắc chắn khác
    return [...correct].reverse();
}

// ============================================================
// MAPPERS — form  <->  (content, correct_answer)
// ============================================================

/**
 * Tách form builder thành 2 cột lưu DB.
 *
 * - `content`        : mảng section, mọi field đáp án đã bị loại bỏ
 * - `correct_answer` : mảng đáp án song song theo [sectionIndex][itemIndex]
 */
export function splitQuestionSections(sections: QuestionFormSection[]): {
    content: QuestionContentSection[];
    correct_answer: QuestionAnswerSection[];
} {
    const content: QuestionContentSection[] = [];
    const correct_answer: QuestionAnswerSection[] = [];

    for (const section of sections) {
        if (section.type === Question_Section_Type.ESSAY) {
            content.push({
                type: Question_Section_Type.ESSAY,
                title: section.title,
                content: section.content,
                // Giới hạn thời gian KHÔNG còn thuộc đề — đây là việc của post
                time_limit: null,
                point: section.point,
            });
            correct_answer.push({
                type: Question_Section_Type.ESSAY,
                sample_answer: section.sample_answer ?? '',
            });
            continue;
        }

        const items: QuestionContentItem[] = [];
        const answerItems: QuestionAnswerItem[] = [];

        for (const item of section.items) {
            const base = { question: item.question, point: item.point };

            switch (item.type) {
                case Question_Item_Type.CHOSE_CORRECT:
                    items.push({
                        ...base,
                        type: Question_Item_Type.CHOSE_CORRECT,
                        options: item.options,
                    });
                    answerItems.push({
                        type: Question_Item_Type.CHOSE_CORRECT,
                        correct_options: item.correct_options,
                    });
                    break;

                case Question_Item_Type.ARRANGE:
                    items.push({
                        ...base,
                        type: Question_Item_Type.ARRANGE,
                        // luôn xáo lại từ thứ tự đúng — người soạn không phải tự xáo
                        shuffled: shuffleForDisplay(item.correct),
                    });
                    answerItems.push({
                        type: Question_Item_Type.ARRANGE,
                        correct: item.correct,
                    });
                    break;

                case Question_Item_Type.PAIRING:
                    // 2 cột lưu TÁCH RỜI; mapping đúng chỉ nằm ở đáp án
                    items.push({
                        ...base,
                        type: Question_Item_Type.PAIRING,
                        keys: item.pairs.map((p) => p.key),
                        values: item.pairs.map((p) => p.value),
                    });
                    answerItems.push({
                        type: Question_Item_Type.PAIRING,
                        pairs: item.pairs,
                    });
                    break;

                case Question_Item_Type.INPUT:
                    items.push({ ...base, type: Question_Item_Type.INPUT });
                    answerItems.push({
                        type: Question_Item_Type.INPUT,
                        correct_answers: item.correct_answers,
                    });
                    break;
            }
        }

        content.push({
            type: Question_Section_Type.MULTIPLE_CHOICE,
            title: section.title,
            content: section.content,
            time_limit: null,
            items,
        });
        correct_answer.push({
            type: Question_Section_Type.MULTIPLE_CHOICE,
            items: answerItems,
        });
    }

    return { content, correct_answer };
}

/**
 * Ghép `content` + `correct_answer` trở lại form builder (dùng khi mở Sửa).
 *
 * Chịu được dữ liệu thiếu/lệch: đáp án thiếu thì lấy giá trị rỗng, để form
 * không vỡ khi mở một đề cũ hoặc đề bị sửa tay trong DB.
 */
export function mergeQuestionSections(
    content: QuestionContentSection[] | null | undefined,
    correct_answer: QuestionAnswerSection[] | null | undefined,
): QuestionFormSection[] {
    if (!Array.isArray(content)) return [];

    const answers = Array.isArray(correct_answer) ? correct_answer : [];

    return content.map((section, sectionIndex): QuestionFormSection => {
        const answer = answers[sectionIndex];

        if (section.type === Question_Section_Type.ESSAY) {
            const essayAnswer =
                answer?.type === Question_Section_Type.ESSAY
                    ? answer.sample_answer
                    : '';
            return {
                type: Question_Section_Type.ESSAY,
                title: section.title ?? '',
                content: section.content ?? {},
                point: section.point ?? 10,
                sample_answer: essayAnswer ?? '',
            };
        }

        const answerItems =
            answer?.type === Question_Section_Type.MULTIPLE_CHOICE &&
            Array.isArray(answer.items)
                ? answer.items
                : [];

        const items = (section.items ?? []).map(
            (item, itemIndex): QuestionFormItem => {
                const itemAnswer = answerItems[itemIndex];
                const base = {
                    question: item.question ?? '',
                    point: item.point ?? 1,
                };

                switch (item.type) {
                    case Question_Item_Type.CHOSE_CORRECT:
                        return {
                            ...base,
                            type: Question_Item_Type.CHOSE_CORRECT,
                            options: item.options ?? [],
                            correct_options:
                                itemAnswer?.type ===
                                Question_Item_Type.CHOSE_CORRECT
                                    ? (itemAnswer.correct_options ?? [])
                                    : [],
                        };

                    case Question_Item_Type.ARRANGE:
                        return {
                            ...base,
                            type: Question_Item_Type.ARRANGE,
                            correct:
                                itemAnswer?.type === Question_Item_Type.ARRANGE
                                    ? (itemAnswer.correct ?? [])
                                    : [],
                        };

                    case Question_Item_Type.PAIRING: {
                        const pairs =
                            itemAnswer?.type === Question_Item_Type.PAIRING &&
                            Array.isArray(itemAnswer.pairs)
                                ? itemAnswer.pairs
                                : [];
                        return {
                            ...base,
                            type: Question_Item_Type.PAIRING,
                            pairs:
                                pairs.length > 0
                                    ? pairs
                                    : (item.keys ?? []).map((key, i) => ({
                                          key,
                                          value: item.values?.[i] ?? '',
                                      })),
                        };
                    }

                    case Question_Item_Type.INPUT:
                        return {
                            ...base,
                            type: Question_Item_Type.INPUT,
                            correct_answers:
                                itemAnswer?.type === Question_Item_Type.INPUT
                                    ? (itemAnswer.correct_answers ?? [])
                                    : [],
                        };
                }
            },
        );

        return {
            type: Question_Section_Type.MULTIPLE_CHOICE,
            title: section.title ?? '',
            content: section.content ?? {},
            items,
        };
    });
}

/** Entity API -> giá trị form (dùng cho modal Sửa) */
export function toFormValues(
    preparation: QuestionPreparation,
): QuestionPreparationForm {
    return {
        title: preparation.title ?? '',
        sections: mergeQuestionSections(
            preparation.content,
            preparation.correct_answer,
        ),
    };
}

// ============================================================
// TYPE GUARDS
// ============================================================

export function isMultipleChoiceSection(
    section: QuestionContentSection,
): section is MultipleChoiceContentSection {
    return section.type === Question_Section_Type.MULTIPLE_CHOICE;
}

export function isEssaySection(
    section: QuestionContentSection,
): section is EssayContentSection {
    return section.type === Question_Section_Type.ESSAY;
}

export function isChoseCorrectItem(
    item: QuestionContentItem,
): item is ChoseCorrectContentItem {
    return item.type === Question_Item_Type.CHOSE_CORRECT;
}

export function isArrangeItem(
    item: QuestionContentItem,
): item is ArrangeContentItem {
    return item.type === Question_Item_Type.ARRANGE;
}

export function isPairingItem(
    item: QuestionContentItem,
): item is PairingContentItem {
    return item.type === Question_Item_Type.PAIRING;
}

export function isInputItem(
    item: QuestionContentItem,
): item is InputContentItem {
    return item.type === Question_Item_Type.INPUT;
}

// ============================================================
// TRA CỨU ĐÁP ÁN THEO VỊ TRÍ
// ============================================================

export function getSectionAnswer(
    correct_answer: QuestionAnswerSection[] | null | undefined,
    sectionIndex: number,
): QuestionAnswerSection | undefined {
    if (!Array.isArray(correct_answer)) return undefined;
    return correct_answer[sectionIndex];
}

export function getItemAnswer(
    correct_answer: QuestionAnswerSection[] | null | undefined,
    sectionIndex: number,
    itemIndex: number,
): QuestionAnswerItem | undefined {
    const section = getSectionAnswer(correct_answer, sectionIndex);
    if (
        section?.type !== Question_Section_Type.MULTIPLE_CHOICE ||
        !Array.isArray(section.items)
    ) {
        return undefined;
    }
    return section.items[itemIndex];
}
