import type {
  Group_Join_Mode,
  Group_View_Mode,
} from '@/enum/group/group_mode.enum';
import type { User_Role, User_Status } from '@/enum/user/user.enum';
import type { Friend_Request_Status } from '@/enum/friend_request/friend_request.enum';
import type {
  Report_Status,
  Target_Type,
} from '@/enum/report/report.enum';
import type { QuestionContentSection } from '@/types/question_preparation/question_preparation.type';

// ============================================================
// PHÂN TRANG — mọi endpoint admin trả CÙNG một hình dạng
// ============================================================

export interface AdminPage<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** Field chung mọi bản ghi đều có (BaseEntity + cờ xoá mềm) */
export interface AdminBaseRow {
  id: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  /** BE tính sẵn từ `deleted_at` */
  is_deleted: boolean;
}

/** Thông tin rút gọn của một người dùng, dùng lồng trong bản ghi khác */
export interface AdminUserBrief {
  id: string;
  user_name: string;
  nickname?: string | null;
  avatar_url?: string | null;
}

// ============================================================
// TỪNG LOẠI BẢN GHI
// ============================================================

export interface AdminUserRow extends AdminBaseRow {
  user_name: string;
  email: string;
  nickname?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role: User_Role;
  status: User_Status;
  status_changed_at?: string | null;
}

export interface AdminGroupRow extends AdminBaseRow {
  slug: string;
  name: string;
  description?: string | null;
  join_mode: Group_Join_Mode;
  view_mode: Group_View_Mode;
  founder?: AdminUserBrief | null;
  /** BE đếm sẵn — CHỈ tính thành viên chưa xoá mềm */
  total_member: number;
}

export interface AdminPostRow extends AdminBaseRow {
  title: string;
  /** Đề bài đầy đủ — dùng lại `SectionView` để hiển thị trong modal */
  content?: QuestionContentSection[];
  description?: string | null;
  deadline_at?: string | null;
  user?: AdminUserBrief | null;
  group?: { id: string; slug: string; name: string } | null;
  post_collection?: { id: string; title: string } | null;
}

export interface AdminPreparationRow extends AdminBaseRow {
  title: string;
  content?: QuestionContentSection[];
  user?: AdminUserBrief | null;
  collection?: { id: string; title: string } | null;
}

export interface AdminRelationshipRow extends AdminBaseRow {
  sender?: AdminUserBrief | null;
  receiver?: AdminUserBrief | null;
  status: Friend_Request_Status;
}

export interface AdminFriendshipRow extends AdminBaseRow {
  user?: AdminUserBrief | null;
  user_friend?: AdminUserBrief | null;
  be_friend_at?: string | null;
}

export interface AdminReportRow extends AdminBaseRow {
  target_type: Target_Type;
  target_id: string;
  reason?: string | null;
  description?: string | null;
  status: Report_Status;
  action_taken?: string | null;
  review_note?: string | null;
  reviewed_at?: string | null;
  user_report?: AdminUserBrief | null;
  review_by?: AdminUserBrief | null;
}

// ============================================================
// THAM SỐ LỌC
// ============================================================

/** Tham số dùng chung cho MỌI màn danh sách admin */
export interface AdminBaseQuery {
  page?: number;
  limit?: number;
  /** ISO date — lọc `created_at >= created_from` */
  created_from?: string;
  /** ISO date — lọc `created_at <= created_to` */
  created_to?: string;
  /** Bật thì trả cả bản ghi đã xoá mềm (kèm `is_deleted`) */
  with_deleted?: boolean;
}

export interface AdminUserQuery extends AdminBaseQuery {
  id?: string;
  user_name?: string;
  email?: string;
  nickname?: string;
  role?: User_Role | '';
  status?: User_Status | '';
}

export interface AdminGroupQuery extends AdminBaseQuery {
  id?: string;
  slug?: string;
  name?: string;
  founder_user_name?: string;
  join_mode?: Group_Join_Mode | '';
  view_mode?: Group_View_Mode | '';
}

export interface AdminPostQuery extends AdminBaseQuery {
  id?: string;
  title?: string;
  group_id?: string;
  collection_id?: string;
  /** Tên người GIAO BÀI */
  user_name?: string;
}

export interface AdminPreparationQuery extends AdminBaseQuery {
  id?: string;
  title?: string;
  collection_id?: string;
  /** Tên CHỦ SỞ HỮU đề */
  user_name?: string;
}

export interface AdminRelationshipQuery extends AdminBaseQuery {
  id?: string;
  /** Khớp ở CẢ HAI phía (người gửi hoặc người nhận) */
  user_name?: string;
  sender_user_name?: string;
  receiver_user_name?: string;
  status?: Friend_Request_Status | '';
}

export interface AdminReportQuery extends AdminBaseQuery {
  id?: string;
  user_name?: string;
  status?: Report_Status | '';
  target_type?: Target_Type | '';
}

export type AdminQuery =
  | AdminUserQuery
  | AdminGroupQuery
  | AdminPostQuery
  | AdminPreparationQuery
  | AdminRelationshipQuery
  | AdminReportQuery;

// ============================================================
// TÀI NGUYÊN — gom một chỗ để hook và trang dùng chung
// ============================================================

export type AdminResource =
  | 'user'
  | 'friend_request'
  | 'friendship'
  | 'group'
  | 'post'
  | 'preparation'
  | 'report';

/** Endpoint danh sách của từng mục sidebar */
export const ADMIN_ENDPOINT: Record<AdminResource, string> = {
  user: 'admin/users',
  friend_request: 'admin/friend_request',
  friendship: 'admin/friendship',
  group: 'admin/group/many',
  post: 'admin/post',
  preparation: 'admin/question_preparation',
  report: 'admin/report',
};

/**
 * Endpoint KHÔI PHỤC của từng mục.
 *
 * `preparation` dùng `/restore/:id` chứ không phải `/:id/restore` vì BE đã có
 * route `PATCH /:user_id/:preparation_id` — hai route cùng 2 segment nên phải
 * tách bằng tiền tố `restore`.
 */
export function adminRestorePath(
  resource: AdminResource,
  id: string,
): string {
  if (resource === 'user') return `admin/users/${id}/restore`;
  if (resource === 'group') return `admin/group/${id}/restore`;
  if (resource === 'post') return `admin/post/${id}/restore`;
  if (resource === 'preparation')
    return `admin/question_preparation/restore/${id}`;
  if (resource === 'friend_request')
    return `admin/friend_request/restore/${id}`;
  if (resource === 'friendship')
    return `admin/friendship/restore/${id}`;
  return `admin/report/restore/${id}`;
}

/**
 * Endpoint XOÁ MỀM của từng mục.
 *
 * `user` KHÔNG có ở đây: hành động quản trị với người dùng là **khoá/mở khoá**
 * (`status` = BANNED/ACTIVE) chứ không phải xoá mềm — đã chốt từ trước.
 */
export function adminDeletePath(
  resource: AdminResource,
  id: string,
): string | null {
  if (resource === 'group') return `admin/group/${id}`;
  if (resource === 'post') return `admin/post/${id}`;
  if (resource === 'preparation') return `admin/question_preparation/${id}`;
  if (resource === 'friend_request') return `admin/friend_request/${id}`;
  if (resource === 'friendship') return null; // friendship xoá bằng DELETE + body cặp id
  if (resource === 'report') return `admin/report/${id}`;
  return null;
}
