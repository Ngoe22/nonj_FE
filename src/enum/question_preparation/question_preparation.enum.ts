/**
 * Loại section trong một đề.
 * GIÁ TRỊ PHẢI KHỚP với `Question_Section_Type` ở BE
 * (`nonj_be/src/_common/helper/question_content.helper.ts`).
 */
export enum Question_Section_Type {
    MULTIPLE_CHOICE = 'multiple_choice',
    ESSAY = 'essay',
}

/**
 * Loại câu hỏi con — chỉ dùng trong section MULTIPLE_CHOICE.
 */
export enum Question_Item_Type {
    CHOSE_CORRECT = 'chose_correct',
    ARRANGE = 'arrange',
    PAIRING = 'pairing',
    INPUT = 'input',
}
