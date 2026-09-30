export enum View_Each_Other_Answer {
    AFTER_ANSWER = 'AFTER_ANSWER',
    AFTER_DEADLINE = 'AFTER_DEADLINE',
    NEVER = 'NEVER',
}

export enum Retake {
    /** 'BEFORE' = được làm lại trước deadline; không deadline thì vô hạn */
    BEFORE_DATELINE = 'BEFORE',
    NEVER = 'NEVER',
}

// Question_Type / Exam_Question_Type đã bỏ:
// loại câu hỏi giờ do TỪNG SECTION mang — xem
// enum/question_preparation/question_preparation.enum.ts
