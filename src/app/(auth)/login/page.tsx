// app/(auth)/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/useLogin';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginMutation.mutateAsync({ username, password });
        router.push('/');   // login xong -> chuyển sang trang chính
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={loginMutation.isPending}>Đăng nhập</button>
            {loginMutation.isError && <p>Sai tài khoản hoặc mật khẩu</p>}
        </form>
    );
}