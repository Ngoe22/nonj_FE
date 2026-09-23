import { z } from 'zod';
import { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';

// ============ Update Group ============
export const updateGroupSchema = z.object({
    name: z
        .string()
        .min(1, 'group_name_required')
        .max(50, 'group_name_max'),

    description: z
        .string()
        .max(500, 'group_description_max')
        .optional()
        .or(z.literal('')),

    join_mode: z.nativeEnum(Group_Join_Mode),
    view_mode: z.nativeEnum(Group_View_Mode),
});

export type UpdateGroupFormValues = z.infer<typeof updateGroupSchema>;

// ============ Default values helper ============
export function getUpdateGroupDefaults(group: {
    name: string;
    description?: string;
    join_mode: Group_Join_Mode;
    view_mode: Group_View_Mode;
}): UpdateGroupFormValues {
    return {
        name: group.name,
        description: group.description ?? '',
        join_mode: group.join_mode,
        view_mode: group.view_mode,
    };
}