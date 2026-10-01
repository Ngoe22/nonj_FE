'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { ClipboardCheck, Trash2 } from 'lucide-react';

import {
  AdminConfirm,
  AdminDateCell,
  AdminDeletedBadge,
  AdminField,
  AdminIdCell,
  AdminListShell,
  AdminPageHeader,
  AdminSelectFilter,
  AdminTextCell,
  AdminTextFilter,
  IconAction,
  adminInputClass,
} from '@/components/admin/_share/AdminListShell.compo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminReviewReport, useAdminSoftDelete } from '@/hooks/admin/admin.hook';
import {
  Report_Action,
  Report_Status,
  Target_Type,
} from '@/enum/report/report.enum';
import type { AdminReportRow } from '@/types/admin/admin.type';

const STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-status-warning-bg text-status-warning',
  REVIEWING: 'bg-status-info-bg text-status-info',
  RESOLVED: 'bg-status-success-bg text-status-success',
  REJECTED: 'bg-status-neutral-bg text-status-neutral',
};

function ReviewModal({
  report,
  onClose,
}: {
  report: AdminReportRow;
  onClose: () => void;
}) {
  const txt = useTranslations('Admin');
  const review = useAdminReviewReport();

  const [status, setStatus] = useState<Report_Status>(report.status);
  const [action, setAction] = useState<string>(
    report.action_taken || Report_Action.NONE,
  );
  const [note, setNote] = useState(report.review_note ?? '');

  const submit = async () => {
    try {
      await review.mutateAsync({
        report_id: report.id,
        body: { status, action_taken: action, review_note: note },
      });
      toast.success(txt('updated_ok'));
      onClose();
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">{txt('review_report')}</h3>

        <p className="mt-2 max-h-40 overflow-auto rounded-lg border border-border bg-background p-3 text-sm whitespace-pre-wrap">
          {report.description || report.reason || '—'}
        </p>

        <div className="mt-4 space-y-3">
          <AdminField label={txt('status')}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Report_Status)}
              className={adminInputClass}
            >
              {Object.values(Report_Status).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label={txt('action_taken')}>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className={adminInputClass}
            >
              {Object.values(Report_Action).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label={txt('review_note')}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${adminInputClass} min-h-20 resize-y`}
            />
          </AdminField>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {txt('cancel')}
          </Button>
          <Button type="button" size="sm" disabled={review.isPending} onClick={submit}>
            {review.isPending ? txt('saving') : txt('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const txt = useTranslations('Admin');
  const remove = useAdminSoftDelete('report');

  const [reviewing, setReviewing] = useState<AdminReportRow | null>(null);
  const [deleting, setDeleting] = useState<AdminReportRow | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success(txt('deleted_ok'));
      setDeleting(null);
    } catch {
      toast.error(txt('action_fail'));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminPageHeader title={txt('nav_reports')} description={txt('reports_hint')} />

      <AdminListShell<AdminReportRow>
        resource="report"
        onRowClick={setReviewing}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'reporter', label: txt('reporter') },
          { key: 'target', label: txt('target') },
          { key: 'reason', label: txt('reason') },
          { key: 'status', label: txt('status') },
          { key: 'created_at', label: txt('created_at') },
        ]}
        renderActions={(row) => (
          <>
            <IconAction label={txt('review_report')} onClick={() => setReviewing(row)}>
              <ClipboardCheck size={14} />
            </IconAction>
            <IconAction label={txt('soft_delete')} tone="danger" onClick={() => setDeleting(row)}>
              <Trash2 size={14} />
            </IconAction>
          </>
        )}
        renderFilters={(query, setFilter) => (
          <>
            <AdminField label={txt('id')}>
              <AdminTextFilter value={query.id ?? ''} onChange={(v) => setFilter('id', v)} />
            </AdminField>
            <AdminField label={txt('reporter')}>
              <AdminTextFilter value={query.user_name ?? ''} onChange={(v) => setFilter('user_name', v)} />
            </AdminField>
            <AdminField label={txt('status')}>
              <AdminSelectFilter
                value={query.status ?? ''}
                onChange={(v) => setFilter('status', v)}
                options={[
                  { value: '', label: txt('all') },
                  ...Object.values(Report_Status).map((value) => ({ value, label: value })),
                ]}
              />
            </AdminField>
            <AdminField label="target_type">
              <AdminSelectFilter
                value={query.target_type ?? ''}
                onChange={(v) => setFilter('target_type', v)}
                options={[
                  { value: '', label: txt('all') },
                  ...Object.values(Target_Type).map((value) => ({ value, label: value })),
                ]}
              />
            </AdminField>
          </>
        )}
        renderRow={(row) => (
          <>
            <AdminIdCell id={row.id} />
            <AdminTextCell value={row.user_report?.user_name} width="max-w-[140px]" />
            <td className="w-[190px] px-3 py-2 align-top">
              <Badge variant="secondary">{row.target_type}</Badge>
              <code className="ml-1.5 text-[11px] text-muted-foreground">
                {String(row.target_id ?? '').slice(0, 8)}
              </code>
            </td>
            <AdminTextCell value={row.reason} width="max-w-[150px]" />
            <td className="w-[150px] px-3 py-2 align-top">
              <Badge className={STATUS_TONE[row.status] ?? ''}>{row.status}</Badge>
              <AdminDeletedBadge isDeleted={row.is_deleted} />
            </td>
            <AdminDateCell value={row.created_at} />
          </>
        )}
      />

      {reviewing && <ReviewModal report={reviewing} onClose={() => setReviewing(null)} />}

      <AdminConfirm
        open={!!deleting}
        title={txt('confirm_delete_title')}
        message={txt('confirm_delete_message')}
        pending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
