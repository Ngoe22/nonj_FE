import {Group_Join_Mode, Group_View_Mode} from "@/enum/group/group_mode.enum";

export type Group = {
    id: string;
    name: string;
    slug: string;
    join_mode : Group_Join_Mode
    view_mode : Group_View_Mode

}