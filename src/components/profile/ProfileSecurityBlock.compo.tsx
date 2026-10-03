'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { LogOut, MailWarning, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.compo';
import SetPasswordForm from '@/components/profile/SetPasswordForm.compo';
import { useLogout } from '@/hooks/auth/useLogout.hook';
import { useResetMyPassword } from '@/hooks/user/userActions.hook';
import { useRouter } from '@/i18n/navigation';

/** Hộp thoại xác nhận nhỏ, dùng chung cho 2 thao tác dưới */
function ConfirmBox({
  open,
  title,
  message,
  confirmLabel,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const txt = useTranslations('Admin');
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            {txt('cancel')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? txt('saving') : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Một dòng: nhãn + mô tả bên trái, nút bên phải */
function Row({
  icon,
  label,
  hint,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-2">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      {action}
    </div>
  );
}

/**
 * Khu "Mật khẩu & bảo mật" ở trang cá nhân.
 *
 * Gồm 3 việc, gộp một chỗ:
 *  1. Đặt/Đổi mật khẩu (thu gọn, bấm mới xổ ra)
 *  2. Reset mật khẩu — gửi mật khẩu mới vào email + thu hồi MỌI phiên
 *  3. Đăng xuất tất cả thiết bị
 */
export default function ProfileSecurityBlock({
  hasPassword = true,
}: {
  /**
   * `true` = đã có mật khẩu -> hiện "Đổi mật khẩu" (cần mật khẩu cũ).
   * `false` = tài khoản Google chưa có mật khẩu -> hiện "Đặt mật khẩu".
   *
   * Mặc định `true` để client cũ (chưa truyền prop) vẫn giữ hành vi cũ.
   */
  hasPassword?: boolean;
}) {
  const txt = useTranslations('Admin');
  const queryClient = useQueryClient();
  const router = useRouter();

  const resetPassword = useResetMyPassword();
  const logout = useLogout();

  const [askReset, setAskReset] = useState(false);
  const [askLogoutAll, setAskLogoutAll] = useState(false);

  const doReset = async () => {
    try {
      await resetPassword.mutateAsync();
      setAskReset(false);
      toast.success(txt('reset_password_sent'));

      // BE đã thu hồi mọi phiên -> phiên hiện tại cũng hết hiệu lực, phải về
      // trang đăng nhập thay vì để người dùng ngồi lại với token sắp chết.
      queryClient.clear();
      router.replace('/auth');
    } catch (err: unknown) {
      // BE rollback nên mật khẩu cũ vẫn dùng được — chỉ cần báo đúng lý do
      const code = (err as { response?: { data?: { errorCode?: string } } })
        ?.response?.data?.errorCode;
      toast.error(
        code === 'email_send_failed' ? txt('email_send_failed') : txt('action_fail'),
      );
    }
  };

  return (
    <div className="space-y-1">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium">{txt('security_block')}</h3>
      </div>

      {/* 1. Đặt mật khẩu (Google chưa có) hoặc Đổi mật khẩu — thu gọn */}
      {hasPassword ? <ChangePasswordForm /> : <SetPasswordForm />}

      <div className="border-t border-border" />

      {/* 2. Reset mật khẩu */}
      <Row
        icon={<MailWarning size={15} />}
        label={txt('reset_password_self')}
        hint={txt('reset_password_self_hint')}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setAskReset(true)}
          >
            {txt('send_mail')}
          </Button>
        }
      />

      <div className="border-t border-border" />

      {/* 3. Đăng xuất tất cả thiết bị */}
      <Row
        icon={<LogOut size={15} />}
        label={txt('logout_all_devices')}
        hint={txt('logout_all_devices_hint')}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 text-destructive"
            onClick={() => setAskLogoutAll(true)}
          >
            {txt('logout')}
          </Button>
        }
      />

      <ConfirmBox
        open={askReset}
        title={txt('confirm_reset_self_title')}
        message={txt('confirm_reset_self_message')}
        confirmLabel={txt('send_mail')}
        pending={resetPassword.isPending}
        onCancel={() => setAskReset(false)}
        onConfirm={doReset}
      />

      <ConfirmBox
        open={askLogoutAll}
        title={txt('confirm_logout_all_title')}
        message={txt('confirm_logout_all_message')}
        confirmLabel={txt('logout')}
        pending={logout.isPending}
        onCancel={() => setAskLogoutAll(false)}
        onConfirm={() => logout.mutate('all')}
      />
    </div>
  );
}
