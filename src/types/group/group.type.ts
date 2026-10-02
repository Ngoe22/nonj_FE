import {Group_Join_Mode, Group_View_Mode} from "@/enum/group/group_mode.enum";
import {CreateGroupFormValues} from "@/schemas/group/group.schema";
import {string} from "zod";

export type Group = {
    id: string;
    name: string;
    slug: string;
    join_mode : Group_Join_Mode
    view_mode : Group_View_Mode
    created_at : Date
    description: string;

    permission : {
        view_setting: boolean ,
        view_join_req :boolean ,
        view_member :boolean ,
        edit_setting: boolean ,
        able_to_leave : boolean ,
        able_to_delete :boolean ,
        create_collection : boolean ,
        /** giao bài trong nhóm — BE thêm key này cho founder + admin */
        create_post : boolean ,
        /**
         * true nếu người đang xem LÀ thành viên nhóm.
         * Người ngoài nhóm vẫn xem được thông tin nhóm + bộ sưu tập (khi
         * view_mode = PUBLIC) nhưng KHÔNG xem được bài tập.
         */
        is_member: boolean,
    }

    /** Người đang xem đã là thành viên nhóm chưa */
    is_joined?: boolean;
    /**
     * Đã có yêu cầu tham gia đang CHỜ DUYỆT chưa.
     *
     * Dùng để hiện trạng thái "đã gửi yêu cầu" thay vì cứ hiện lại nút Join —
     * nếu không người dùng tưởng nút không chạy và bấm liên tục.
     */
    has_pending_request?: boolean;
}

export type UpdateGroup = {
        name: string;
        join_mode : Group_Join_Mode
        view_mode : Group_View_Mode
        description?: string;

}