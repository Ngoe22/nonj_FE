'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, LogIn, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { api } from '@/lib/axios/axios';
import { User_Role } from '@/enum/user/user.enum';
import { adminInputClass } from '@/components/admin/_share/AdminListShell.compo';

/**
 * Trang đăng nhập RIÊNG của khu quản trị.
 *
 * Dùng chung API `/auth/login` và cookie `access_token` với app người dùng (đã
 * chốt như vậy). Điểm khác biệt: sau khi đăng nhập phải kiểm tra quyền
 * SYSTEM_ADMIN — nếu không phải thì **đăng xuất ngay** và báo lỗi, chứ không để
 * một tài khoản thường giữ phiên trong khu quản trị.
 */
export default function AdminLogin() {
  const txt = useTranslations('Admin');
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await api.post('auth/login', { email, password });

      const res = await api.get('user/me');
      const role = res.data.data?.role;

      if (role !== User_Role.SYSTEM_ADMIN) {
        // Không phải admin -> huỷ luôn phiên vừa tạo
        await api.post('auth/logout/all').catch(() => {});
        setError(txt('not_admin'));
        return;
      }

      // Xoá cache để không lẫn dữ liệu của tài khoản đăng nhập trước
      queryClient.clear();
      router.replace('/admin');
    } catch {
      setError(txt('login_fail'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-6"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-muted-foreground" />
          <h1 className="text-lg font-semibold">{txt('login_title')}</h1>
        </div>

        <p className="text-sm text-muted-foreground">{txt('login_hint')}</p>

        <label className="block">
          <span className="text-sm font-medium">{txt('email')}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 ${adminInputClass}`}
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">{txt('password')}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 ${adminInputClass}`}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-2.5 text-xs text-destructive">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <LogIn size={15} />
          {busy ? txt('logging_in') : txt('login')}
        </Button>
      </form>
    </div>
  );
}
