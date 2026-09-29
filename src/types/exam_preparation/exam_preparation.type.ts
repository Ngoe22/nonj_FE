// ============================================================
// Collection
// ============================================================
import {Exam_Question_Type, Question_Type} from "@/enum/post/post.enum";

export interface ExamCollection {
    id: string;
    title: string;
    desc?: string | null;
    created_at: string;
}

// ============================================================
// Base
// ============================================================
interface BaseSection {
    time_limit: number | null;   // null = không giới hạn
    title: string;
}

interface BaseQA {
    point: number;
    question: {
        text ?: string
        img_url ?: string
        mp3_url ?: string
    };
}

//ESSAY

// MULTIPLE_CHOICE
// ============================================================
// 1. CHOSE_CORRECT — chọn đáp án đúng
// ============================================================
export interface ChoseCorrectSection extends BaseSection {
    type: Exam_Question_Type.CHOSE_CORRECT;
    QA: ChoseCorrectQA[];
}

export interface ChoseCorrectQA extends BaseQA {
    // point + question
    option  : string
}

export interface  ChoseCorrectAnswer {
    correct_answer: string[];
}

// ============================================================
// 2. ARRANGE — sắp xếp
// ============================================================
export interface ArrangeSection extends BaseSection {
    type: Exam_Question_Type.ARRANGE;
    QA: ArrangeQA[];
}

export interface ArrangeQA extends BaseQA {
    // point + question
    option  : string
}

export interface  ArrangeAnswer {
    correct_answer: string[];
}


// ============================================================
// 3. PAIRING — nối cặp
// ============================================================
export interface PairingQA extends BaseQA {
    // point + question
    /** Mảng 2 hàng: [hàng trái, hàng phải] */
    option: string[][];            // [[a,b,c],[1,2,3]]

}

export interface PairingSection extends BaseSection {
    type: Exam_Question_Type.PAIRING;
    QA: PairingQA[];
}


export interface  PairingAnswer {
    /** Mảng các cặp [trái, phải] */
    correct_answer: string[][];   // [[a,1],[b,2],[c,3]]
}

// ============================================================
// 4. INPUT — điền text
// ============================================================
export interface InputSection extends BaseSection {
    type: Exam_Question_Type.INPUT;
    QA: InputQA[];
}

export interface InputQA extends BaseQA {
    // point + question
}

export interface  InputAnswer {
    correct_answer: string;   // text user nhập
}

// ============================================================
// Union
// ============================================================
export type ExamSection =
    | ChoseCorrectSection
    | ArrangeSection
    | PairingSection
    | InputSection
    ;

export type AnswerSection =
    | ChoseCorrectAnswer
    | ArrangeAnswer
    | PairingAnswer
    | InputAnswer
    ;

export type ExamQA =
    | ChoseCorrectQA
    | ArrangeQA
    | PairingQA
    | InputQA;

/** Mảng section — đây chính là `exercise_content` */
export type ExerciseContent = ExamSection[];
export type AnswerContent = AnswerSection[];


// ============================================================
// ExamTemplate
// ============================================================

export interface ExamTemplate {
    id: string;
    title: string;
    question_type : Question_Type
    exercise_content: ExerciseContent;
    correct_answer ?: AnswerContent ;
    created_at: string;
}

/**
 *  if type Essay just send exercise_content only ,  render textEditable for user
 * */

//======================================================================================================

// ============================================================
// Mutation vars
// ============================================================

// Exam

export interface CreateTemplateVars {
    title: string;
    exercise_content: ExerciseContent;
    correct_answer ?: AnswerContent ;
}

export interface UpdateTemplateVars {
    collection_id: string;
    template_id: string;
    body?: {
        title?: string;
        exercise_content?: ExerciseContent;
        correct_answer ?: AnswerContent ;
    };
}

export interface DeleteTemplateVars {
    template_id: string;
}


// Collection

export interface CreateCollectionVars {
    title: string;
    desc?: string;
}

export interface UpdateCollectionVars {
    id: string;
    body: { title?: string; desc?: string };
}
