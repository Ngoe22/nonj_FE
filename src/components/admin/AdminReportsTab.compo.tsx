'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Gavel } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AdminListShell,
    AdminPager,
} from '@/components/admin/_share/AdminPager.compo';

import {
    useAdminReports,
    useAdminReviewReport,
} from '@/hooks/admin/admin.hook';
import { useRelativeTime } from '@/helper/timeFormat/relativeTime.helper';
import type { AdminReport } from '@/types/admin/admin.type';

const fieldClass =
    'w-full rounded-md border-2 border-status-info p-2 text-sm outline-none';

const REPORT_STATUSES = [
    'PENDING',
    'REVIEWING',
    'RESOLVED',
    'REJECTED',
] as const;

const REPORT_ACTIONS = [
    'NONE',
    'CONTENT_REMOVED',
    'USER_WARNED',
    'USER_FROZEN',
    'GROUP_CLOSED',
] as const;

export default function AdminReportsTab() {
    const txt = useTranslations('Admin');
    const relative = useRelativeTime();

    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [reviewing, setReviewing] = useState<AdminReport | null>(null);
    const [status, setStatus] = useState<string>('RESOLVED');
    const [action, setAction] = useState<string>('NONE');
    const [note, setNote] = useState('');

    const { data: reports, isLoading } = useAdminReports(
        page,
        statusFilter || undefined,
    );
    const reviewReport = useAdminReviewReport();

    const openReview = (report: AdminReport) => {
        setReviewing(report);
        setStatus(report.status === 'PENDING' ? 'RESOLVED' : report.status);
        setAction(report.action_taken ?? 'NONE');
        setNote(report.review_note ?? '');
    };

    const submit = async () => {
        if (!reviewing) return;
        await reviewReport.mutateAsync({
            report_id: reviewing.id,
            body: { status, action_taken: action, review_note: note },
        });
        setReviewing(null);
    };

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium">
                    {txt('report_status')}
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-md border-2 border-status-info p-2 text-sm outline-none"
                >
                    <option value="">{txt('all')}</option>
                    {REPORT_STATUSES.map((value) => (
                        <option key={value} value={value}>
                            {txt(`report_status_${value.toLowerCase()}`)}
                        </option>
                    ))}
                </select>
            </div>

            <AdminListShell
                isLoading={isLoading}
                isEmpty={(reports?.length ?? 0) === 0}
                emptyText={txt('empty')}
            >
                {(reports ?? []).map((report) => (
                    <div
                        key={report.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {txt('report_reason')}:{' '}
                                {txt(
                                    `report_reason_${report.reason.toLowerCase()}`,
                                )}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {txt('report_by')}:{' '}
                                {report.user_report?.nickname ??
                                    report.user_report?.user_name ??
                                    '—'}{' '}
                                · {txt('report_target')}:{' '}
                                {txt(
                                    `report_target_${report.target_type.toLowerCase()}`,
                                )}{' '}
                                · {relative(report.created_at)}
                            </p>
                        </div>

                        <Badge
                            variant="secondary"
                            className={
                                report.status === 'PENDING'
                                    ? 'text-amber-600'
                                    : ''
                            }
                        >
                            {txt(
                                `report_status_${report.status.toLowerCase()}`,
                            )}
                        </Badge>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1.5"
                            onClick={() => openReview(report)}
                        >
                            <Gavel size={13} />
                            {txt('process')}
                        </Button>
                    </div>
                ))}
            </AdminListShell>

            <AdminPager
                page={page}
                count={reports?.length ?? 0}
                onPage={setPage}
            />

            <Dialog
                open={!!reviewing}
                onOpenChange={(value) => !value && setReviewing(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{txt('process')}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-border bg-surface p-3 text-sm">
                            <p className="text-xs text-muted-foreground">
                                {txt('report_description')}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">
                                {reviewing?.description || '—'}
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('report_status')}
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className={fieldClass}
                                >
                                    {REPORT_STATUSES.map((value) => (
                                        <option key={value} value={value}>
                                            {txt(
                                                `report_status_${value.toLowerCase()}`,
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    {txt('report_action')}
                                </label>
                                <select
                                    value={action}
                                    onChange={(e) =>
                                        setAction(e.target.value)
                                    }
                                    className={fieldClass}
                                >
                                    {REPORT_ACTIONS.map((value) => (
                                        <option key={value} value={value}>
                                            {txt(
                                                `report_action_${value.toLowerCase()}`,
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {txt('report_note')}
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className={`${fieldClass} min-h-20 resize-y`}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReviewing(null)}
                            >
                                {txt('cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={reviewReport.isPending}
                            >
                                {reviewReport.isPending
                                    ? txt('saving')
                                    : txt('confirm')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
