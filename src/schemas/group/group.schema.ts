// schemas/group/create-group.schema.ts
import { z } from 'zod';
import {Group_Join_Mode, Group_View_Mode} from "@/enum/group/group_mode.enum";


export const createGroupSchema = z.object({
    slug: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50')
        .regex(/^[a-z0-9_]+$/, 'only_letter_and_number_and_underscore'),

    name: z
        .string()
        .min(1, 'enter_something')
        .max(50, 'max_char_50'),

    description: z
        .string()
        .max(500, 'max_char_50')
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