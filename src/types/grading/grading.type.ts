/**
 * Kết quả chấm điểm do BE trả về trong `post_answer.review_content.auto`.
 * Shape PHẢI khớp `GradeResult` ở BE
 * (`nonj_be/src/_common/helper/grading.helper.ts`).
 */

export interface GradedItemResult {
    type: string;
    max_point: number;
    earned_point: number;
    /** null = không chấm tự động được */
    is_correct: boolean | null;
    /** đáp án đúng — chỉ có ở bài làm CỦA MÌNH */
    expected?: unknown;
    /** bài làm đã nộp */
    received?: unknown;
}

export interface GradedSection {
    type: string;
    /** vị trí section trong `post.content` */
    index: number;
    max_point: number;
    point: number;
    /** essay thì rỗng */
    items: GradedItemResult[];
    /** essay: đáp án mẫu */
    sample_answer?: unknown;
    /** essay: bài làm của học viên */
    answer_text?: unknown;
}

export interface GradeResult {
    point: number;
    max_point: number;
    sections: GradedSection[];
    fully_auto_graded: boolean;
}
