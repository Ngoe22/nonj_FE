import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email( 'invalid_email').min(1, 'enter_something'),
    password: z.string().min(6, 'at_least_char_6'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;