'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'react-toastify';
import { UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UsernameCheck from '@/components/_share/check_field/UsernameCheck.compo';
import { useSetUsername } from '@/hooks/user/userActions.hook';
import { useGetMyProfile } from '@/hooks/profile/useGetMyProfile.hook';

/**
 * Màn CHỌN USERNAME — hiện khi tài khoản Google mới đăng nhập lần đầu mà chưa
 * có username (BE đặt `user_name = null`). Chưa chọn thì không dùng app được.
 */
export default function UsernameSetup() {
  const txt = useTranslations('Admin');
  const router = useRouter();
  const setUsername = useSetUsername();

  const { data: me, isLoading } = useGetMyProfile();

  /**
   * Lưới an toàn: nếu tài khoản ĐÃ có username mà vẫn vào được màn này (do cache
   * cũ, mở lại tab, hoặc bị đá nhầm) thì đi thẳng vào app — không để người dùng
   * kẹt ở modal chọn username.
   */
  useEffect(() => {
    if (!isLoading && me?.user_name) router.replace('/');
  }, [isLoading, me, router]);

  const [value, setValue] = useState('');
  // username đã check xong — chưa check thì không cho xác nhận
  const [checkedValue, setCheckedValue] = useState<string | null>(null);
  const ready = checkedValue !== null && checkedValue === value.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // chặn cả khi bấm Enter, không chỉ dựa vào `disabled` của nút
    if (!ready) return;

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
          <UsernameCheck
            value={value}
            mode="username"
            onResult={(r) => setCheckedValue(r.available ? r.value : null)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={setUsername.isPending || !ready}>
          {setUsername.isPending ? txt('saving') : txt('confirm')}
        </Button>
      </form>
    </div>
  );
}
