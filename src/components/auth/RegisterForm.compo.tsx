'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useRegister} from "@/hooks/auth/useRegister";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormValues, registerSchema} from "@/schemas/auth/register.schemas";
import {InvalidInput} from "@/components/_share/form_error_warning/FormErrorWarning.compo";
import {GoogleLoginButton} from "@/components/auth/GoogleLoginButton.compo";
import UsernameCheck from "@/components/_share/check_field/UsernameCheck.compo";

export default function RegisterForm() {
    const router = useRouter();
    const txt = useTranslations('Auth')

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    // giá trị đang gõ ở ô username — truyền cho nút "Kiểm tra" trùng
    const userNameValue = watch('user_name') ?? '';

    const registerMutation = useRegister();


    const registerSubmit = async (data:RegisterFormValues) => {
        try {
            const result = await registerMutation.mutateAsync(data);
            // console.log(result)
            router.push('/'); // Chỉ chuyển trang khi thành công
        } catch (error) {
            console.error( error);
        }
    }


    return (
        <div>
            <div className="mb-7">
                <h2 className="text-2xl font-bold text-foreground">
                    {txt('manual_header')}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {txt('manual_desc')}
                </p>
            </div>

            <form
                onSubmit={handleSubmit( registerSubmit )}
                className="space-y-4"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_email_label')}
                    </label>

                    <input
                        {...register('email')}
                        type="email"
                        placeholder= {txt('manual_register_email_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground"
                    />
                    {errors.email && <InvalidInput msg = {errors.email.message}  />}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_user_name_label')}
                    </label>

                    <input
                        {...register('user_name')}
                        placeholder={txt('manual_register_user_name_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground"
                    />
                    <div className="mt-2">
                        <UsernameCheck value={userNameValue} mode="username" />
                    </div>
                    {errors.user_name && <InvalidInput msg = {errors.user_name.message}  />}

                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_nickname_label')}
                    </label>

                    <input
                        {...register('nickname')}
                        placeholder={txt('manual_register_nickname_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground"
                    />
                    {errors.nickname && <InvalidInput msg = {errors.nickname.message}  />}

                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_password_label')}
                    </label>

                    <input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground"
                    />
                    {errors.password && <InvalidInput msg = {errors.password.message}  />}

                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_bio_label')}
                    </label>

                    <textarea
                        {...register('bio')}
                        placeholder={txt('manual_register_bio_pld')}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
                    />
                    {errors.bio && <InvalidInput msg = {errors.bio.message}  />}

                </div>

                <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {registerMutation.isPending
                        ? '.....'
                        : txt('register_btn')}
                </button>


            </form>
            {registerMutation.isError && (
                <p className="rounded-xl border border-status-error bg-[var(--status-error-bg)] px-4 py-3 text-sm text-[var(--status-error)]">
                    {txt('register_fail')}
                </p>
            )}

        </div>
    );
}