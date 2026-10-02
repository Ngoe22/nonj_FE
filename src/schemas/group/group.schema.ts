// schemas/group/create-group.schema.ts
import { z } from 'zod';
import {Group_Join_Mode, Group_View_Mode} from "@/enum/group/group_mode.enum";


export const createGroupSchema = z.object({
    slug: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50')
        // KHỚP regex của BE (`Group` entity: /^[a-zA-Z0-9]+$/). Trước đây FE cho
        // phép thêm `_` nên submit sẽ bị BE trả 400.
        .regex(/^[a-zA-Z0-9]+$/, 'only_letter_and_number'),

    name: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50'),

    description: z
        .string()
        .max(500, 'max_char_500')
        .optional()
        .or(z.literal('')),

    join_mode: z
        .enum([Group_Join_Mode.PUBLIC, Group_Join_Mode.BY_REQUEST])
        .optional(),

    view_mode: z
        .enum([Group_View_Mode.PUBLIC, Group_View_Mode.PRIVATE])
        .optional(),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

// Default values cho form
export const createGroupDefaultValues: CreateGroupFormValues = {
    slug: '',
    name: '',
    description: '',
    join_mode: Group_Join_Mode.PUBLIC,
    view_mode: Group_View_Mode.PUBLIC,
};