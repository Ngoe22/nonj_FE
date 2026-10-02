'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2, X } from 'lucide-react';

import { useCheckSlug, useCheckUsername } from '@/hooks/user/userActions.hook';

/**
 * Định dạng hợp lệ — PHẢI khớp regex ở BE, nếu lệch thì nút Check báo "Dùng được"
 * nhưng lúc submit BE lại trả 400.
 *
 *  - username (`CreateUserDto`): /^[a-zA-Z0-9_]+$/, dài 3–50
 *  - slug nhóm (`Group` entity): /^[a-zA-Z0-9]+$/, KHÔNG có dấu `_`, dài 1–50
 */
const VALID_PATTERN = {
  username: /^[a-zA-Z0-9_]{3,50}$/,
  slug: /^[a-zA-Z0-9]{1,50}$/,
} as const;

interface Props {
  value: string;
  mode?: 'username' | 'slug';
  /**
   * Báo cho form biết giá trị NÀO đã check xong và kết quả ra sao.
   *
   * Form dùng giá trị này để chặn nút Lưu: chỉ cho lưu khi giá trị ĐÃ CHECK
   * trùng với giá trị đang gõ. Nhờ vậy không bao giờ submit rồi mới ăn lỗi
   * duplicate từ service.
   */
  onResult?: (result: { value: string; available: boolean }) => void;
}

/**
 * Nút "Kiểm tra" đặt cạnh ô nhập username/slug.
 *
 * Gọi API check trùng (`POST /user/check_existing/:name` hoặc
 * `/group/check_existing/:slug`) rồi báo "Dùng được" / "Đã bị dùng".
 *
 * Điểm quan trọng: state lưu **cặp (giá trị đã check, kết quả)** chứ không chỉ
 * lưu kết quả. Nhờ vậy khi người dùng gõ tiếp, giá trị hiện tại khác giá trị đã
 * check -> kết quả cũ TỰ HẾT hiệu lực và nút trở về trạng thái "Kiểm tra".
 *
 * (Trước đây chỉ lưu kết quả nên check pass xong gõ giá trị khác vẫn hiện
 * "Dùng được" — sai, và người dùng submit rồi mới bị lỗi trùng.)
 */
export default function UsernameCheck({ value, mode = 'username', onResult }: Props) {
  const txt = useTranslations('Admin');
  const checkUsername = useCheckUsername();
  const checkSlug = useCheckSlug();

  const [checked, setChecked] = useState<{
    value: string;
    available: boolean;
  } | null>(null);

  const trimmed = value.trim();

  /**
   * Sai định dạng -> KHÔNG gọi API.
   *
   * Trước đây bấm Check với `asd123123vv$$` vẫn ra "Dùng được" (vì API chỉ kiểm
   * tra trùng, không kiểm tra định dạng) — vừa gây hiểu nhầm vừa cho phép bấm
   * Lưu rồi mới bị BE chặn.
   */
  const invalid = trimmed.length > 0 && !VALID_PATTERN[mode].test(trimmed);

  // Kết quả chỉ còn hiệu lực khi nó thuộc ĐÚNG chuỗi đang gõ
  const current = checked?.value === trimmed ? checked : null;

  const checking = checkUsername.isPending || checkSlug.isPending;
  const disabled = checking || !trimmed || invalid;

  const run = async () => {
    if (disabled) return;

    try {
      const taken =
        mode === 'username'
          ? await checkUsername.mutateAsync(trimmed)
          : await checkSlug.mutateAsync(trimmed);

      const result = { value: trimmed, available: !taken };
      setChecked(result);
      onResult?.(result);
    } catch {
      setChecked(null);
    }
  };

  const tone = invalid
    ? 'text-destructive'
    : current
      ? current.available
        ? 'text-status-success'
        : 'text-destructive'
      : 'text-muted-foreground';

  // Có chữ nhưng CHƯA check (hoặc vừa đổi giá trị) -> nhắc phải bấm Kiểm tra
  const needCheck = !invalid && !current && !checking && trimmed.length > 0;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={run}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs transition ${tone} ${
        disabled ? 'opacity-50' : 'hover:bg-surface-hover'
      }`}
    >
      {checking ? (
        <Loader2 size={12} className="animate-spin" />
      ) : current?.available ? (
        <Check size={12} />
      ) : current ? (
        <X size={12} />
      ) : null}

      {checking
        ? txt('checking')
        : current
          ? current.available
            ? txt('available')
            : txt('taken')
          : txt('check')}
    </button>

    {invalid && (
      <span className="text-xs text-destructive">
        {mode === 'username'
          ? txt('invalid_username_format')
          : txt('invalid_slug_format')}
      </span>
    )}

    {needCheck && (
      <span className="text-xs text-muted-foreground">
        {txt('must_check_first')}
      </span>
    )}
    </span>
  );
}
