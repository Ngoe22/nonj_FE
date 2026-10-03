'use client';

import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  Copy,
  RotateCcw,
  Search,
  Trash2,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ADMIN_PAGE_SIZE,
  useAdminList,
  useAdminRestore,
} from '@/hooks/admin/admin.hook';
import { copyToClipboard } from '@/helper/clipboard/clipboard.helper';
import { formatDeadline } from '@/lib/format/datetime';
import {
  canRestoreAdminResource,
  type AdminPage,
  type AdminQuery,
  type AdminResource,
} from '@/types/admin/admin.type';

// ============================================================
// Ô NHẬP — trung tính, KHÔNG dùng viền xanh
// ============================================================

export const adminInputClass =
  'w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground/35';

/** Ô nhập lọc, có nhãn ở trên */
export function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AdminTextFilter({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={adminInputClass}
    />
  );
}

export function AdminSelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={adminInputClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// ============================================================
// Ô DỮ LIỆU — cắt bằng dấu …, hover xem đủ, nháy đôi để copy
// ============================================================

/** Nháy đôi vào ô là copy; hiện dấu ✓ trong giây lát để biết đã copy */
function CopyableText({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <span
      // `title` cho hover xem nội dung đầy đủ khi bị cắt
      title={value}
      onDoubleClick={async (e) => {
        e.stopPropagation();
        if (await copyToClipboard(value)) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }
      }}
      className="flex min-w-0 cursor-copy items-center gap-1.5"
    >
      <span className="min-w-0 truncate">{value}</span>
      {copied && <Check size={12} className="shrink-0 text-status-success" />}
    </span>
  );
}

/** Ô văn bản thường */
export function AdminTextCell({
  value,
  width = 'max-w-[220px]',
}: {
  value?: string | number | null;
  width?: string;
}) {
  if (value === null || value === undefined || value === '')
    return <td className="px-3 py-2 align-top text-muted-foreground">—</td>;

  return (
    <td className={`${width} px-3 py-2 align-top`}>
      <CopyableText value={String(value)} />
    </td>
  );
}

/**
 * Ô ID: hiện 8 ký tự đầu + nút copy.
 *
 * Cột uuid đầy đủ sẽ chiếm hết chiều ngang và làm bảng không đọc được, nên chỉ
 * hiện phần đầu; vẫn copy/lấy được id đầy đủ khi cần.
 */
export function AdminIdCell({ id }: { id: string }) {
  const txt = useTranslations('Admin');
  const [copied, setCopied] = useState(false);

  return (
    <td className="w-[104px] px-3 py-2 align-top">
      <span className="flex items-center gap-1">
        <code
          title={id}
          className="cursor-copy text-xs text-muted-foreground"
          onDoubleClick={async (e) => {
            e.stopPropagation();
            if (await copyToClipboard(id)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }
          }}
        >
          {id.slice(0, 8)}
        </code>
        <button
          type="button"
          aria-label={txt('copy_id')}
          title={txt('copy_id')}
          onClick={async (e) => {
            e.stopPropagation();
            if (await copyToClipboard(id)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }
          }}
          className="rounded p-0.5 text-muted-foreground/50 transition hover:bg-surface-hover hover:text-foreground"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      </span>
    </td>
  );
}

/** Ô ngày tháng */
export function AdminDateCell({ value }: { value?: string | null }) {
  if (!value) return <td className="px-3 py-2 align-top text-muted-foreground">—</td>;

  return (
    <td className="w-[132px] px-3 py-2 align-top whitespace-nowrap tabular-nums text-muted-foreground">
      {formatDeadline(value) ?? value}
    </td>
  );
}

/** Badge "đã xoá" — chỉ hiện khi bật "hiện cả đã xoá" */
export function AdminDeletedBadge({ isDeleted }: { isDeleted: boolean }) {
  const txt = useTranslations('Admin');
  if (!isDeleted) return null;

  return (
    <Badge variant="destructive" className="ml-1.5 gap-1 align-middle">
      <Trash2 size={10} />
      {txt('deleted')}
    </Badge>
  );
}

/**
 * Nút thao tác trên một dòng.
 *
 * `stopPropagation` là BẮT BUỘC: cả dòng có `onClick` mở chi tiết, không chặn
 * thì bấm nút Sửa sẽ vừa sửa vừa mở luôn modal chi tiết.
 */
export function IconAction({
  label,
  tone = 'normal',
  onClick,
  children,
  disabled = false,
}: {
  label: string;
  tone?: 'normal' | 'danger';
  onClick: () => void;
  children: ReactNode;
  /** Đang gửi request -> khoá nút, tránh bấm nhiều lần */
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`rounded p-1.5 transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${
        tone === 'danger'
          ? 'text-muted-foreground hover:text-destructive'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// HỘP THOẠI XÁC NHẬN cho thao tác nguy hiểm
// ============================================================

export function AdminConfirm({
  open,
  title,
  message,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const txt = useTranslations('Admin');
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
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
            {pending ? txt('saving') : txt('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHELL — tìm khi bấm nút, thao tác dòng, cuộn TRONG vùng dữ liệu
// ============================================================

export interface AdminColumn {
  key: string;
  label: string;
  className?: string;
}

interface Props<T> {
  resource: AdminResource;
  renderFilters: (
    query: Record<string, string>,
    setFilter: (key: string, value: string) => void,
  ) => ReactNode;
  columns: AdminColumn[];
  /**
   * Lọc điền SẴN từ URL (ví dụ bấm một bộ sưu tập ở trang Nhóm thì sang đây
   * với `collection_id` đã có). Trang gọi nên truyền thêm `key` theo URL để
   * component mount lại khi tham số đổi.
   */
  initialFilters?: Record<string, string>;
  renderRow: (row: T, index: number) => ReactNode;
  /** Nút thao tác riêng của từng mục, hiện ở cột cuối */
  renderActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

/**
 * KHUNG danh sách DÙNG CHUNG cho cả 7 mục admin (user / friend_request /
 * friendship / group / post / preparation / report).
 *
 * Tại sao gom lại một chỗ:
 *   - Mọi trang cần CÙNG một cách hoạt động: thanh lọc + bảng + phân trang +
 *     tick "hiện cả đã xoá" + nút khôi phục. Viết 7 lần thì lệch nhau ngay.
 *   - Logic khó (đổi filter phải quay trang 1, tách "đang gõ" vs "đã áp dụng",
 *     điền filter sẵn từ URL, cột trạng thái xoá động) chỉ cần đúng MỘT lần.
 *
 * Cách nó hoạt động:
 *   - `draft`  = ô lọc đang gõ (KHÔNG gọi API theo từng ký tự).
 *   - `applied` = giá trị đã bấm "Tìm" -> mới đưa vào `query` để gọi API.
 *   - `renderFilters` do từng trang cung cấp để vẽ ô lọc riêng của mình.
 *   - `renderRow` trả về các `<td>`; shell tự thêm cột "thao tác" ở cuối và —
 *     khi bật "hiện cả đã xoá" — thêm CỘT "trạng thái xoá".
 *   - Bảng `overflow-auto` nên CHỈ vùng dữ liệu cuộn (thân trang đứng yên).
 */
export function AdminListShell<T extends { id: string; is_deleted: boolean }>({
  resource,
  renderFilters,
  columns,
  initialFilters,
  renderRow,
  renderActions,
  onRowClick,
}: Props<T>) {
  const txt = useTranslations('Admin');


  const seed = initialFilters ?? {};
  const [draft, setDraft] = useState<Record<string, string>>(seed);
  // điền sẵn thì phải TÌM LUÔN, không thì bảng trống cho tới khi bấm Tìm
  const [applied, setApplied] = useState<Record<string, string>>(seed);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [appliedRange, setAppliedRange] = useState({ from: '', to: '' });
  const [withDeleted, setWithDeleted] = useState(false);
  const [page, setPage] = useState(1);

  const query = useMemo<AdminQuery>(
    () => ({
      ...applied,
      page,
      limit: ADMIN_PAGE_SIZE,
      with_deleted: withDeleted || undefined,
      created_from: appliedRange.from
        ? new Date(appliedRange.from).toISOString()
        : undefined,
      // datetime-local đã gồm cả giờ:phút, nên KHÔNG thêm hậu tố cuối ngày
      // nữa (trước đây type=date phải gắn 23:59:59 để hết ngày).
      created_to: appliedRange.to
        ? new Date(appliedRange.to).toISOString()
        : undefined,
    }),
    [applied, page, withDeleted, appliedRange],
  );

  const { data, isLoading, isFetching, isError } = useAdminList<T>(resource, query);
  const restore = useAdminRestore(resource);

  const setFilter = (key: string, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setApplied(draft);
    setAppliedRange({ from: draftFrom, to: draftTo });
    setPage(1);
  };

  const clearAll = () => {
    setDraft({});
    setApplied({});
    setDraftFrom('');
    setDraftTo('');
    setAppliedRange({ from: '', to: '' });
    setWithDeleted(false);
    setPage(1);
  };

  const pageData = data as AdminPage<T> | undefined;
  const totalPages = pageData
    ? Math.max(1, Math.ceil(pageData.total / (pageData.limit || ADMIN_PAGE_SIZE)))
    : 1;

  // Khi bật "hiện cả đã xoá" thì thêm MỘT cột nữa — các trạng thái loading/empty
  // phải colSpan đúng tổng cột, nếu không bảng vỡ.
  const totalCols = columns.length + 1 + (withDeleted ? 1 : 0);

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col gap-3">
      {/* -------------------- Bộ lọc -------------------- */}
      <div className="shrink-0 rounded-xl border border-border bg-surface p-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {renderFilters(draft, setFilter)}

          <AdminField label={txt('created_from')}>
            <input
              type="datetime-local"
              value={draftFrom}
              onChange={(e) => setDraftFrom(e.target.value)}
              className={adminInputClass}
            />
          </AdminField>

          <AdminField label={txt('created_to')}>
            <input
              type="datetime-local"
              value={draftTo}
              onChange={(e) => setDraftTo(e.target.value)}
              className={adminInputClass}
            />
          </AdminField>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={withDeleted}
              onChange={(e) => {
                setWithDeleted(e.target.checked);
                setPage(1);
              }}
              className="h-3.5 w-3.5 rounded-sm accent-foreground"
            />
            {txt('show_deleted')}
          </label>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
              <RotateCcw size={13} />
              {txt('clear_filters')}
            </Button>
            <Button type="submit" size="sm">
              <Search size={13} />
              {txt('search')}
            </Button>
          </div>
        </div>
      </div>

      {/* -------------------- Bảng: cuộn CẢ HAI chiều ở đây -------------------- */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-2 text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
              {withDeleted && (
                <th className="w-[110px] px-3 py-2 text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {txt('deleted_status')}
                </th>
              )}
              <th className="w-[132px] px-3 py-2 text-right text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {txt('actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-3 py-12 text-center text-muted-foreground"
                >
                  {txt('loading')}
                </td>
              </tr>
            )}

            {isError && !isLoading && (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-3 py-12 text-center text-destructive"
                >
                  {txt('load_fail')}
                </td>
              </tr>
            )}

            {/* `placeholderData` giữ dữ liệu CŨ khi đổi bộ lọc nên `isLoading`
                là false; nếu không báo gì thì người dùng tưởng bảng đã cập nhật
                (kể cả `total` ở footer vẫn là số cũ). */}
            {isFetching && !isLoading && (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-3 py-1 text-center text-[11px] text-muted-foreground"
                >
                  {txt('loading')}
                </td>
              </tr>
            )}

            {!isLoading && !isError && pageData?.items.length === 0 && (
              <tr>
                <td
                  colSpan={totalCols}
                  className="px-3 py-12 text-center text-muted-foreground"
                >
                  {txt('empty')}
                </td>
              </tr>
            )}

            {pageData?.items.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border/60 transition ${
                  onRowClick ? 'cursor-pointer hover:bg-surface-hover/50' : ''
                } ${row.is_deleted ? 'opacity-55' : ''}`}
              >
                {renderRow(row, index)}

                {withDeleted && (
                  <td className="px-3 py-2 align-top">
                    {row.is_deleted ? (
                      <Badge variant="destructive">{txt('deleted')}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                )}

                <td className="px-3 py-2 text-right align-top whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    {renderActions?.(row)}

                    {row.is_deleted && canRestoreAdminResource(resource) && (
                      <button
                        type="button"
                        title={txt('restore')}
                        disabled={restore.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          restore.mutate(row.id);
                        }}
                        className="rounded p-1.5 text-muted-foreground transition hover:bg-surface-hover hover:text-status-success disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {restore.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------------------- Phân trang -------------------- */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {txt('total_rows', { total: pageData?.total ?? 0 })}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {txt('prev')}
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {page}/{totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {txt('next')}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Tiêu đề trang admin */
export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-3 shrink-0">
      <h1 className="text-base font-medium">{title}</h1>
      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
