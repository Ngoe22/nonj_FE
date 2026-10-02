'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { ChevronDown, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useChangePassword } from '@/hooks/user/userActions.hook';

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/35';

/**
 * Đổi mật khẩu — THU GỌN mặc định.
 *
 * Bình thường chỉ chiếm 1 dòng; bấm vào mới xổ ra 3 ô nhập. Nhờ vậy khu "Mật
 * khẩu & bảo mật" không choán hết trang cá nhân.
 */
export default function ChangePasswordForm() {
  const txt = useTranslations('Admin');
  const change = useChangePassword();

  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const reset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirm('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      toast.error(txt('password_mismatch'));
      return;
    }

    try {
      await change.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success(txt('password_changed'));
      reset();
      setOpen(false);
    } catch (err: unknown) {
      const code = (err as { response?: { data?: { errorCode?: string } } })
        ?.response?.data?.errorCode;
      toast.error(
        code === 'old_password_incorrect'
          ? txt('old_password_incorrect')
          : txt('action_fail'),
      );
    }
  };

  return (
    <div>
      {/* Một dòng — bấm để mở/đóng */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg py-2 text-left text-sm font-medium transition hover:text-foreground"
      >
        <KeyRound size={15} className="shrink-0 text-muted-foreground" />
        <span className="flex-1">{txt('change_password')}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <form onSubmit={submit} className="mt-2 space-y-2.5 pl-6">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={txt('old_password')}
            autoComplete="current-password"
            className={fieldClass}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={txt('new_password')}
            autoComplete="new-password"
            className={fieldClass}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={txt('confirm_password')}
            autoComplete="new-password"
            className={fieldClass}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              {txt('cancel')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                change.isPending ||
                !oldPassword ||
                !newPassword ||
                !confirm
              }
            >
              {change.isPending ? txt('saving') : txt('confirm')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
