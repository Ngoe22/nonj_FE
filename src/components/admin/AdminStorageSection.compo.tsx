'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { adminInputClass } from '@/components/admin/_share/AdminListShell.compo';
import {
  useAdminStorageObjects,
  useRunStorageGc,
} from '@/hooks/config/use_admin_storage.hook';

/**
 * Mục "Kho lưu trữ (R2)" trong /admin/config.
 *
 * Cho admin:
 * - Xem kho đang giữ những object nào (`ref_count` = còn bao nhiêu nơi dùng).
 * - Chạy dọn rác NGAY thay vì chờ cron 4h sáng.
 *
 * Cron `storage-gc-daily` vẫn chạy hằng ngày; nút này chỉ để chủ động/kiểm chứng.
 */
export function AdminStorageSection() {
  const txt = useTranslations('Admin');

  const [page, setPage] = useState(1);
  const [onlyOrphans, setOnlyOrphans] = useState(false);
  const [graceDays, setGraceDays] = useState('7');

  const query = useAdminStorageObjects(page, onlyOrphans);
  const gc = useRunStorageGc();

  const data = query.data;
  const stats = data?.stats;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const runGc = async () => {
    const days = Number(graceDays);
    if (!Number.isFinite(days) || days < 0) {
      toast.error(txt('storage_invalid_days'));
      return;
    }
    try {
      const res = await gc.mutateAsync(Math.floor(days));
      toast.success(txt('storage_gc_done', { count: res.deleted }));
    } catch {
      toast.error(txt('storage_gc_failed'));
    }
  };

  const fmt = (iso: string) => (iso ? iso.slice(0, 10) : '—');

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-sm font-semibold">{txt('config_group_storage')}</h2>

      {/* -------- số liệu -------- */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: txt('storage_total'), value: stats?.total },
          { label: txt('storage_referenced'), value: stats?.referenced },
          { label: txt('storage_orphans'), value: stats?.orphans },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface px-3 py-2"
          >
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="text-lg font-semibold">
              {query.isLoading ? '…' : (s.value ?? 0)}
            </div>
          </div>
        ))}
      </div>

      {/* -------- chạy dọn ngay -------- */}
      <div className="rounded-xl border border-border p-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {txt('storage_grace_days')}
            </label>
            <input
              type="number"
              min={0}
              max={365}
              step={1}
              value={graceDays}
              onChange={(e) => setGraceDays(e.target.value)}
              className={`${adminInputClass} w-28`}
            />
          </div>

          <Button
            type="button"
            onClick={runGc}
            disabled={gc.isPending}
            className="gap-2"
          >
            {gc.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {gc.isPending ? txt('storage_gc_running') : txt('storage_gc_now')}
          </Button>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {txt('storage_grace_hint')}
        </p>
      </div>

      {/* -------- bảng object -------- */}
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={onlyOrphans}
            onChange={(e) => {
              setOnlyOrphans(e.target.checked);
              setPage(1);
            }}
          />
          {txt('storage_only_orphans')}
        </label>

        <button
          type="button"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={query.isFetching ? 'animate-spin' : undefined}
          />
          {txt('storage_reload')}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {query.isLoading ? (
          <p className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            {txt('loading')}
          </p>
        ) : query.isError ? (
          <p className="py-8 text-center text-xs text-destructive">
            {txt('load_failed')}
          </p>
        ) : data && data.items.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {txt('storage_empty')}
          </p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{txt('storage_col_key')}</th>
                <th className="px-3 py-2 font-medium">{txt('storage_col_ref')}</th>
                <th className="px-3 py-2 font-medium">
                  {txt('storage_col_updated')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td
                    className="max-w-[22rem] truncate px-3 py-2"
                    title={o.key}
                  >
                    {o.key}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        o.ref_count === 0
                          ? 'text-muted-foreground'
                          : 'font-medium text-status-success'
                      }
                    >
                      {o.ref_count}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {fmt(o.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* -------- phân trang -------- */}
      {data && data.total > data.limit && (
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
          >
            {txt('prev_page')}
          </button>
          <span className="text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
          >
            {txt('next_page')}
          </button>
        </div>
      )}
    </section>
  );
}
