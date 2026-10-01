import type {
    PairingPair,
    QuestionAnswerSection,
    QuestionContentSection,
} from '@/types/question_preparation/question_preparation.type';
import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';
import { Question_Item_Type, Question_Section_Type } from '@/enum/question_preparation/question_preparation.enum';

// ============================================================
// Quyền trên một post (BE trả kèm theo từng item/chi tiết)
// ============================================================

export interface PostPermission {
    create: boolean;
    update: boolean;
    delete: boolean;
    take: boolean;
}

// ============================================================
// Entity
// ============================================================

/**
 * Post trong nhóm = bản COPY nội dung của một QuestionPreparation
 * + deadline / retake / quyền xem đáp án của người khác.
 */
export interface Post {
    id: string;
    title: string;
    description: string | null;

    /** Cùng shape với QuestionPreparation.content */
    content: QuestionContentSection[];

    /**
     * CHỈ có khi:
     *  - người xem là admin/founder của nhóm, HOẶC
     *  - người xem là member và ĐÃ làm bài
     * Member chưa làm sẽ KHÔNG nhận được field này.
     */
    correct_answer?: QuestionAnswerSection[] | null;

    deadline_at: string | null;
    retake: Retake;
    view_each_other_answer: View_Each_Other_Answer;

    created_at: string;

    permission: PostPermission;

    user?: {
        id: string;
        user_name?: string;
        nickname?: string;
        avatar_url?: string | null;
    };
    group?: {
        id: string;
        slug?: string;
        name?: string;
    };
    post_collection?: {
        id: string;
        title?: string;
    };
}

// ============================================================
// Mutation vars
// ============================================================

export interface CreatePostVars {
    title: string;
    description?: string;
    content: QuestionContentSection[];
    correct_answer?: QuestionAnswerSection[] | null;
    retake?: Retake;
    deadline_at?: string | null;
    view_each_other_answer?: View_Each_Other_Answer;
}

export interface CreatePostFromPreparationVars {
    preparation_id: string;
    title?: string;
    description?: string;
    retake?: Retake;
    deadline_at?: string | null;
    view_each_other_answer?: View_Each_Other_Answer;
}

/** CHỈ sửa được các field bọc ngoài — nội dung câu hỏi bị khoá */
export interface UpdatePostVars {
    id: string;
    body: {
        title?: string;
        description?: string;
        deadline_at?: string | null;
        view_each_other_answer?: View_Each_Other_Answer;
        /** BE `UpdatePostDto` đã nhận field này */
        retake?: Retake;
    };
}

// ============================================================
// BÀI NỘP — shape gửi lên `answer_content`
// Song song với `correct_answer`, KHÔNG chứa `point`.
// ============================================================

export interface SubmissionChoseCorrectItem {
    type: Question_Item_Type.CHOSE_CORRECT;
    /** index các lựa chọn đã chọn */
    correct_options: number[];
}

export interface SubmissionArrangeItem {
    type: Question_Item_Type.ARRANGE;
    /** thứ tự học viên sắp */
    correct: string[];
}

export interface SubmissionPairingItem {
    type: Question_Item_Type.PAIRING;
    pairs: PairingPair[];
}

export interface SubmissionInputItem {
    type: Question_Item_Type.INPUT;
    /** học viên gõ 1 đáp án -> mảng 1 phần tử */
    correct_answers: string[];
}

export type SubmissionItem =
    | SubmissionChoseCorrectItem
    | SubmissionArrangeItem
    | SubmissionPairingItem
    | SubmissionInputItem;

export interface SubmissionMultipleChoiceSection {
    type: Question_Section_Type.MULTIPLE_CHOICE;
    items: SubmissionItem[];
}

export interface SubmissionEssaySection {
    type: Question_Section_Type.ESSAY;
    text: string;
}

export type SubmissionSection =
    | SubmissionMultipleChoiceSection
    | SubmissionEssaySection;

// ============================================================
// Tiện ích
// ============================================================

/** Đã quá deadline chưa (null = không giới hạn) */
export function isPastDeadline(deadline_at: string | null | undefined): boolean {
    if (!deadline_at) return false;
    return new Date() > new Date(deadline_at);
}

/** Có được làm lại không */
export function canRetake(
    retake: Retake,
    deadline_at: string | null | undefined,
): boolean {
    if (retake === Retake.NEVER) return false;
    // Retake.BEFORE_DATELINE: không deadline = làm lại vô hạn
    return !isPastDeadline(deadline_at);
}
