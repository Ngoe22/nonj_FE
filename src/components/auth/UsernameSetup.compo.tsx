'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'react-toastify';
import { UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UsernameCheck from '@/components/_share/check_field/UsernameCheck.compo';
import { useSetUsername } from '@/hooks/user/userActions.hook';

/**
 * Màn CHỌN USERNAME — hiện khi tài khoản Google mới đăng nhập lần đầu mà chưa
 * có username (BE đặt `user_name = null`). Chưa chọn thì không dùng app được.
 */
export default function UsernameSetup() {
  const txt = useTranslations('Admin');
  const router = useRouter();
  const setUsername = useSetUsername();

  const [value, setValue] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setUsername.mutateAsync(value.trim());
      toast.success(txt('updated_ok'));
      router.replace('/');
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="flex items-center gap-2">
          <UserRound size={20} className="text-muted-foreground" />
          <h1 className="text-lg font-semibold">{txt('choose_username')}</h1>
        </div>

        <p className="text-sm text-muted-foreground">{txt('username_required_hint')}</p>

        <div className="space-y-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={txt('username')}
            autoFocus
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/35"
          />
          <UsernameCheck value={value} mode="username" />
        </div>

        <Button type="submit" className="w-full" disabled={setUsername.isPending || value.trim().length < 3}>
          {setUsername.isPending ? txt('saving') : txt('confirm')}
        </Button>
      </form>
    </div>
  );
}
