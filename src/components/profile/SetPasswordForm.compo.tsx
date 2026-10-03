'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { ChevronDown, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSetPassword } from '@/hooks/user/userActions.hook';

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/35';

/**
 * Đặt mật khẩu LẦN ĐẦU — dành cho tài khoản Google chưa có mật khẩu.
 *
 * Khác `ChangePasswordForm` ở chỗ KHÔNG có ô "mật khẩu hiện tại": tài khoản Google
 * vốn chưa có mật khẩu nên không có gì để nhập. Chỉ cần nhập mật khẩu mới 2 lần
 * (khớp nhau) rồi submit.
 *
 * Sau khi đặt xong, BE trả `has_password = true` và `ProfileSecurityBlock` tự đổi
 * sang hiển thị "Đổi mật khẩu".
 */
export default function SetPasswordForm() {
  const txt = useTranslations('Admin');
  const setPw = useSetPassword();

  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const reset = () => {
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
      await setPw.mutateAsync(newPassword);
      toast.success(txt('password_set'));
      reset();
      setOpen(false);
    } catch (err: unknown) {
      const code = (err as { response?: { data?: { errorCode?: string } } })
        ?.response?.data?.errorCode;
      toast.error(
        code === 'password_already_set'
          ? txt('password_already_set')
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
        <span className="flex-1">{txt('set_password')}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <form onSubmit={submit} className="mt-2 space-y-2.5 pl-6">
          <p className="text-xs text-muted-foreground">
            {txt('set_password_hint')}
          </p>

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
              disabled={setPw.isPending || !newPassword || !confirm}
            >
              {setPw.isPending ? txt('saving') : txt('confirm')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
