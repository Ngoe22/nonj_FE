'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2, X } from 'lucide-react';

import { useCheckSlug, useCheckUsername } from '@/hooks/user/userActions.hook';

/**
 * Nút "Kiểm tra" đặt cạnh ô nhập username/slug.
 *
 * Tự gọi API check trùng (`POST /user/check_existing/:name` hoặc
 * `/group/check_existing/:slug`) rồi báo "Dùng được" / "Đã bị dùng". Không phụ
 * thuộc vào react-hook-form nên nhét vào form nào cũng được — chỉ cần truyền
 * `value` (giá trị đang gõ).
 */
export default function UsernameCheck({
  value,
  mode = 'username',
}: {
  value: string;
  mode?: 'username' | 'slug';
}) {
  const txt = useTranslations('Admin');
  const checkUsername = useCheckUsername();
  const checkSlug = useCheckSlug();

  const [state, setState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checking = checkUsername.isPending || checkSlug.isPending;
  const disabled = checking || !value.trim();

  const run = async () => {
    if (disabled) return;
    setState('checking');
    try {
      const taken =
        mode === 'username'
          ? await checkUsername.mutateAsync(value.trim())
          : await checkSlug.mutateAsync(value.trim());
      setState(taken ? 'taken' : 'available');
    } catch {
      setState('idle');
    }
  };

  const tone =
    state === 'available'
      ? 'text-status-success'
      : state === 'taken'
        ? 'text-destructive'
        : 'text-muted-foreground';

  return (
    <button
      type="button"
      onClick={run}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition ${tone} ${
        disabled ? 'opacity-50' : 'hover:bg-surface-hover'
      }`}
    >
      {state === 'checking' ? (
        <Loader2 size={12} className="animate-spin" />
      ) : state === 'available' ? (
        <Check size={12} />
      ) : state === 'taken' ? (
        <X size={12} />
      ) : null}
      {state === 'checking'
        ? txt('checking')
        : state === 'available'
          ? txt('available')
          : state === 'taken'
            ? txt('taken')
            : txt('check')}
    </button>
  );
}
