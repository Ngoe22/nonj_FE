import { z } from 'zod';

export const updateMyInfoSchema = z.object({
    nickname: z.string().min(1,'enter_nickname').max(50,'max_char_50'),
    bio: z.string().max(100,'max_char_100').optional(),
})
export type updateMyInfoFormValues = z.infer<typeof updateMyInfoSchema>;