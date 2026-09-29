import {ExamTemplate} from "@/types/exam_preparation/exam_preparation.type";
import {Retake, View_Each_Other_Answer} from "@/enum/post/post.enum";

export interface Post extends ExamTemplate {
    description: string | null;


    deadline_at: Date | null;

    retake: Retake;

    view_each_other_answer: View_Each_Other_Answer;
}