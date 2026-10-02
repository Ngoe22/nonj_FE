'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Flag } from 'lucide-react';

import { useCreateReport } from '@/hooks/report/report.hook';
import {
  Report_Reason,
  Target_Type,
} from '@/enum/report/report.enum';

const REASONS = Object.values(Report_Reason);

const fieldClass =
  'mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-foreground/35';

/**
 * Nút "Báo cáo vi phạm" + modal dùng chung cho 3 đối tượng (user / group /
 * post).
 *
 * - `variant="menu"` : mục trong menu 3 chấm (nhóm, bài tập).
 * - `variant="button"` : nút bấm đứng riêng (dưới nút kết bạn).
 *
 * Modal 2 bước:
 *   1) chọn lý do + viết mô tả (CẢ HAI bắt buộc), target đã điền sẵn (read-only)
 *   2) xác nhận, ghi rõ "báo cáo sai sự thật sẽ bị khoá tài khoản"
 */
export default function ReportButton({
  target_type,
  target_id,
  variant = 'button',
}: {
  target_type: Target_Type;
  target_id: string;
  variant?: 'button' | 'menu';
}) {
  const txt = useTranslations('Report');
  const create = useCreateReport();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [reason, setReason] = useState<Report_Reason | ''>('');
  const [description, setDescription] = useState('');

  const openModal = () => {
    setReason('');
    setDescription('');
    setStep('form');
    setOpen(true);
  };

  const valid = reason !== '' && description.trim() !== '';

  const submit = async () => {
    try {
      await create.mutateAsync({
        target_type,
        target_id,
        reason: reason as Report_Reason,
        description: description.trim(),
      });
      toast.success(txt('report_sent'));
      setOpen(false);
    } catch {
      toast.error(txt('report_fail'));
    }
  };

  const titleKey = `report_${target_type.toLowerCase()}`;

  return (
    <>
      {variant === 'menu' ? (
        <button
          type="button"
          onClick={openModal}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
        >
          <Flag size={17} />
          {txt('report_violation')}
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
        >
          <Flag size={15} />
          {txt('report_violation')}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {step === 'form' ? (
              <>
                <h3 className="font-medium">{txt(titleKey)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {txt('target')}: <code>{target_id.slice(0, 8)}</code>
                </p>

                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs text-muted-foreground">
                      {txt('reason')} *
                    </span>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value as Report_Reason)}
                      className={fieldClass}
                    >
                      <option value="">{txt('reason_placeholder')}</option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {txt(`reason_${r}`)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs text-muted-foreground">
                      {txt('description')} *
                    </span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${fieldClass} min-h-24 resize-y`}
                    />
                  </label>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-hover"
                  >
                    {txt('cancel')}
                  </button>
                  <button
                    type="button"
                    disabled={!valid}
                    onClick={() => setStep('confirm')}
                    className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background disabled:opacity-40"
                  >
                    {txt('next')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-medium text-destructive">{txt('confirm_title')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{txt('confirm_warning')}</p>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-hover"
                  >
                    {txt('back')}
                  </button>
                  <button
                    type="button"
                    disabled={create.isPending}
                    onClick={submit}
                    className="rounded-md bg-destructive px-3 py-1.5 text-sm text-white disabled:opacity-40"
                  >
                    {create.isPending ? txt('submitting') : txt('submit')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
