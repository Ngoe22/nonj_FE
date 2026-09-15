// app/(auth)/login/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useRegister} from "@/hooks/auth/useRegister";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        user_name: '',
        nickname: '',
        bio: '',
    });

    const loginMutation = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginMutation.mutateAsync(formData);
        router.push('/');
    };

    return (
        <>
            <div >REGISTER</div>
            <form onSubmit={handleSubmit}>

                <input name="email" value={formData.email} onChange={handleChange} />
                <input name="password" value={formData.password} onChange={handleChange} />
                <input name="user_name" value={formData.user_name} onChange={handleChange} />
                <input name="nickname" value={formData.nickname} onChange={handleChange} />
                <input name="bio" value={formData.bio} onChange={handleChange} />

                <button type="submit" disabled={loginMutation.isPending}>Register</button>
                {loginMutation.isError && <p>Register Fail</p>}
            </form>
        </>
    );
}