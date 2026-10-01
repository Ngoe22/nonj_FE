'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useChangePassword } from '@/hooks/user/userActions.hook';

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/35';

/**
 * Tự đổi mật khẩu — bắt buộc mật khẩu hiện tại.
 *
 * Form yêu cầu: mật khẩu hiện tại + mật khẩu mới + nhập lại. Hai mật khẩu mới
 * phải khớp (check ở client), mật khẩu hiện tại do BE xác nhận.
 */
export default function ChangePasswordForm() {
  const txt = useTranslations('Admin');
  const change = useChangePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      toast.error(txt('password_mismatch'));
      return;
    }

    try {
      await change.mutateAsync({ old_password: oldPassword, new_password: newPassword });
      toast.success(txt('password_changed'));
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <KeyRound size={15} className="text-muted-foreground" />
        {txt('change_password')}
      </h3>

      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder={txt('old_password')}
        className={fieldClass}
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={txt('new_password')}
        className={fieldClass}
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={txt('confirm_password')}
        className={fieldClass}
      />

      <Button type="submit" size="sm" disabled={change.isPending || !oldPassword || !newPassword || !confirm}>
        {change.isPending ? txt('saving') : txt('change_password')}
      </Button>
    </form>
  );
}
