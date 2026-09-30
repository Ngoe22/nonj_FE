import type { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';
import type { QuestionAnswerSection, QuestionContentSection } from '@/types/question_preparation/question_preparation.type';
import { Retake, View_Each_Other_Answer } from '@/enum/post/post.enum';

export enum Admin_User_Status {
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED',
}

// ============================================================
// User
// ============================================================

export interface AdminUser {
    id: string;
    user_name: string;
    email: string;
    nickname: string;
    bio?: string | null;
    avatar_url?: string | null;
    role: 'USER' | 'SYSTEM_ADMIN';
    status: Admin_User_Status;
    google_id?: string | null;
    created_at: string;
    status_changed_at?: string | null;
}

// ============================================================
// Group
// ============================================================

export interface AdminGroup {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    join_mode: Group_Join_Mode;
    view_mode: Group_View_Mode;
    created_at: string;
    founder?: {
        id: string;
        user_name?: string;
        nickname?: string;
        avatar_url?: string | null;
    };
}

// ============================================================
// Collection (bộ sưu tập bài tập trong nhóm)
// ============================================================

export interface AdminCollection {
    id: string;
    title: string;
    desc?: string | null;
    created_at?: string;
    group?: { id: string; name?: string; slug?: string };
}

// ============================================================
// Post
// ============================================================

export interface AdminPost {
    id: string;
    title: string;
    description?: string | null;
    content?: QuestionContentSection[];
    correct_answer?: QuestionAnswerSection[] | null;
    deadline_at?: string | null;
    retake?: Retake;
    view_each_other_answer?: View_Each_Other_Answer;
    created_at: string;
    user?: { id: string; user_name?: string; nickname?: string };
    post_collection?: { id: string; title?: string };
}

// ============================================================
// Report
// ============================================================

export interface AdminReport {
    id: string;
    target_type: string;
    target_id: string;
    reason: string;
    description: string;
    status: string;
    action_taken?: string | null;
    review_note?: string | null;
    reviewed_at?: string | null;
    created_at: string;
    user_report?: {
        id: string;
        user_name?: string;
        nickname?: string;
        avatar_url?: string | null;
    };
    review_by?: { id: string; user_name?: string; nickname?: string } | null;
}

// ============================================================
// Bộ sưu tập đề CÁ NHÂN của một user (admin tra cứu)
// ============================================================

export interface AdminPreparationCollection {
    id: string;
    title: string;
    desc?: string | null;
    created_at?: string;
}
