'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useRegister} from "@/hooks/auth/useRegister";
import {useTranslations} from "next-intl";

export default function RegisterForm() {
    const router = useRouter();
    const txt = useTranslations('Auth')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        user_name: '',
        nickname: '',
        bio: '',
    });

    const registerMutation = useRegister();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await registerMutation.mutateAsync(formData);

        router.push('/');
    };

    return (
        <div>
            <div className="mb-7">
                <h2 className="text-2xl font-bold text-foreground">
                    {txt('manual_header')}
                </h2>

                <p className="mt-2 text-sm text-muted">
                    {txt('manual_desc')}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_email_label')}
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder= {txt('manual_register_email_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_user_name_label')}
                    </label>

                    <input
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder={txt('manual_register_user_name_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_nickname_label')}
                    </label>

                    <input
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder={txt('manual_register_nickname_plh')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_password_label')}
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {txt('manual_register_bio_label')}
                    </label>

                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder={txt('manual_register_bio_pld')}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-border-strong"
                    />
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

                {registerMutation.isError && (
                    <p className="rounded-xl border border-status-error bg-[var(--status-error-bg)] px-4 py-3 text-sm text-[var(--status-error)]">
                        {txt('register_fail')}
                    </p>
                )}
            </form>
        </div>
    );
}