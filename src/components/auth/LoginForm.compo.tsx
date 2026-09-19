'use client';

import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/useLogin';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '@/schemas/auth/login.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {InvalidInput} from "@/components/_share/form_error_warning/FormErrorWarning.compo";

export default function LoginForm() {
    const txt = useTranslations('Auth');
    const router = useRouter();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const loginSubmit = async (data: LoginFormValues) => {
        await loginMutation.mutateAsync(data);
        router.push('/');
    };

    return (
        <div>
            <div className="mb-7">
                <h2 className="text-2xl font-bold text-foreground">{txt('login_welcome_txt')}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{txt('login_welcome_desc')}</p>
            </div>

            <form onSubmit={handleSubmit(loginSubmit)} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('login_email_label')}
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        placeholder={txt('login_email_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground"
                    />
                    {errors.email && <InvalidInput msg = {errors.email.message}  />}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('login_password_label')}
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
                    />
                    {errors.password && <InvalidInput msg = {errors.password.message}  />}
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loginMutation.isPending ? '.....' : txt('login_btn')}
                </button>

                {loginMutation.isError && (
                    <p className="rounded-xl border border-[var(--status-error)] bg-[var(--status-error-bg)] px-4 py-3 text-sm text-[var(--status-error)]">
                        {txt('login_fail')}
                    </p>
                )}
            </form>
        </div>
    );
}