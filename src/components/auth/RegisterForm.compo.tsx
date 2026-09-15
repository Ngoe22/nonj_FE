'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useRegister} from "@/hooks/auth/useRegister";

export default function RegisterForm() {
    const router = useRouter();

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
                    Tạo tài khoản
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Đăng ký tài khoản mới để bắt đầu.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-border-strong"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Username
                    </label>

                    <input
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="username"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-border-strong"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Nickname
                    </label>

                    <input
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="Nickname"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-border-strong"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Mật khẩu
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-border-strong"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Bio
                    </label>

                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Giới thiệu về bạn..."
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
                        ? 'Đang đăng ký...'
                        : 'Đăng ký'}
                </button>

                {registerMutation.isError && (
                    <p className="rounded-xl border border-[var(--status-error)] bg-[var(--status-error-bg)] px-4 py-3 text-sm text-[var(--status-error)]">
                        Đăng ký thất bại
                    </p>
                )}
            </form>
        </div>
    );
}