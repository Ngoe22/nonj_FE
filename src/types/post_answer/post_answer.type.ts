import type { GradeResult } from '@/types/grading/grading.type';
import type { SubmissionSection } from '@/types/post/post.type';
import { Post_Answer_Status } from '@/enum/post_answer/post_answer.enum';

/**
 * Bài làm của một học viên cho một post.
 *
 * `review_content` CHỈ được BE trả về cho CHÍNH chủ bài làm (hoặc admin/founder)
 * vì `auto.expected` chứa đáp án đúng.
 */
export interface PostAnswer {
    id: string;

    /** Bài đã nộp — shape song song với `correct_answer`, không có `point` */
    answer_content: SubmissionSection[];

    /** Điểm đạt được (BE chấm tự động phần trắc nghiệm) */
    point: number | null;
    /** Tổng điểm tối đa của đề tại thời điểm nộp */
    max_point: number | null;

    status: Post_Answer_Status;
    graded_at: string | null;

    /** Chỉ có ở bài CỦA MÌNH */
    review_content?:
        | {
              auto?: GradeResult;
              manual?: Record<string, unknown>;
          }
        | null;

    user?: {
        id: string;
        user_name?: string;
        nickname?: string;
        avatar_url?: string | null;
    };
}

export interface SubmitAnswerVars {
    answer_content: SubmissionSection[];
}

/** Chấm tay MỘT section tự luận */
export interface GradeSectionVars {
    /** vị trí section trong `post.content` */
    index: number;
    point: number;
    /** ghi đè đáp án mẫu — BE lưu vào `post.correct_answer[index]` */
    sample_answer?: string;
    /** nhận xét riêng cho câu này */
    comment?: string;
}

export interface GradeAnswerVars {
    answer_id: string;
    /** chấm từng phần tự luận */
    sections?: GradeSectionVars[];
    /** ghi đè TỔNG điểm (bỏ trống = auto trắc nghiệm + tay tự luận) */
    point?: number;
    review_note?: string;
    status?: Post_Answer_Status;
}

/** Kết quả giáo viên đã chấm, nằm trong `review_content.manual` */
export interface ManualGradeInfo {
    graded_by?: string;
    graded_at?: string;
    note?: string;
    sections?: GradeSectionVars[];
    total_override?: number | null;
    auto_point?: number;
}

/** Thống kê nhanh để hiển thị trên thẻ post */
export function scoreLabel(answer: PostAnswer | null | undefined): string | null {
    if (!answer) return null;
    if (answer.point === null || answer.max_point === null) return null;
    return `${answer.point}/${answer.max_point}`;
}

/** Lấy điểm/ghi chú giáo viên đã chấm cho 1 section (nếu có) */
export function manualSection(
    answer: PostAnswer | null | undefined,
    sectionIndex: number,
): GradeSectionVars | undefined {
    const manual = answer?.review_content?.manual as
        | ManualGradeInfo
        | undefined;
    return manual?.sections?.find((item) => item.index === sectionIndex);
}
