'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ClipboardCopy, X } from 'lucide-react';

import { copyToClipboard } from '@/helper/clipboard/clipboard.helper';

export interface AdminDetailField {
  label: string;
  value?: string | number | boolean | null;
  /** true = giữ nguyên xuống dòng (dùng cho mô tả / nội dung dài) */
  multiline?: boolean;
}

function FieldValue({ field }: { field: AdminDetailField }) {
  const [copied, setCopied] = useState(false);
  const text = field.value === null || field.value === undefined || field.value === ''
    ? '—'
    : String(field.value);

  const copy = async () => {
    if (await copyToClipboard(text === '—' ? '' : text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <span className="flex min-w-0 items-start gap-1.5">
      <span
        title={text === '—' ? undefined : text}
        onDoubleClick={copy}
        className={`min-w-0 cursor-copy ${field.multiline ? 'whitespace-pre-wrap break-words' : 'break-all'}`}
      >
        {text}
      </span>
      <button
        type="button"
        onClick={copy}
        title="Copy"
        className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition hover:bg-surface-hover hover:text-foreground"
      >
        {copied ? <Check size={12} /> : <ClipboardCopy size={12} />}
      </button>
    </span>
  );
}

/**
 * Modal chi tiết DÙNG CHUNG cho mọi trang admin.
 *
 * Bấm một dòng -> modal này hiện TOÀN BỘ trường của bản ghi, mỗi dòng đều copy
 * được (nháy đôi hoặc bấm nút copy cạnh nó), cộng nút "copy hết" để dán luôn cả
 * khối thông tin. Admin hay cần copy id/email nên đây là điểm trọng tâm.
 */
export default function AdminDetailModal({
  title,
  subtitle,
  fields,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  fields: AdminDetailField[];
  /** Nội dung mở rộng (vd: nội dung đề, danh sách bộ sưu tập) */
  children?: ReactNode;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    const lines = [
      title,
      ...fields.map((field) => `${field.label}: ${field.value ?? ''}`),
    ].join('\n');

    if (await copyToClipboard(lines)) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-border p-4">
          <div className="min-w-0 flex-1">
            <h3 className="wrap-break-word font-medium">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={copyAll}
            title={txt('copy_all')}
            className="flex shrink-0 items-center gap-1 rounded p-1.5 text-xs text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            {copiedAll ? <Check size={14} /> : <ClipboardCopy size={14} />}
            {txt('copy_all')}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={txt('close')}
            className="shrink-0 rounded p-1 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground"
          >
            <X size={16} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          <dl className="space-y-2">
            {fields.map((field) => (
              <div key={field.label} className="flex gap-3 text-sm">
                <dt className="w-40 shrink-0 text-xs tracking-wide text-muted-foreground uppercase">
                  {field.label}
                </dt>
                <dd className="min-w-0 flex-1 text-foreground">
                  <FieldValue field={field} />
                </dd>
              </div>
            ))}
          </dl>

          {children && <div className="mt-4 border-t border-border pt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}
