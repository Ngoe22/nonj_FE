import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email('invalid_email'),
    password: z.string().min(6,'at_least_char_6').max(50,'max_char_50'),
    nickname: z.string().min(1,'enter_something').max(50,'max_char_50'),
    user_name: z
        .string()
        .min(3,'at_least_char_3')
        .max(50,'max_char_50')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'only_letter_and_number_and_underscore'
        ),
    bio: z.string().max(100,'max_char_100').optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;