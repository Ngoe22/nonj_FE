import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';

/** 1 object trong kho R2 */
export interface StorageObjectRow {
  id: string;
  key: string;
  url: string;
  ref_count: number;
  created_at: string;
  updated_at: string;
}

export interface StorageStats {
  total: number;
  orphans: number;
  referenced: number;
}

export interface StorageListResult {
  items: StorageObjectRow[];
  total: number;
  page: number;
  limit: number;
  stats: StorageStats;
}

export const STORAGE_OBJECTS_KEY = ['admin_storage_objects'];

/**
 * Danh sách object trong kho R2 (chỉ SYSTEM_ADMIN).
 *
 * `onlyOrphans` = chỉ lấy object `ref_count = 0` (rác chờ cron 4h sáng dọn).
 */
export function useAdminStorageObjects(page = 1, onlyOrphans = false) {
  return useQuery<StorageListResult>({
    queryKey: [...STORAGE_OBJECTS_KEY, page, onlyOrphans],
    queryFn: async () => {
      const res = await api.get<{ data: StorageListResult }>(
        'admin/storage/objects',
        {
          params: { page, limit: 20, only_orphans: onlyOrphans || undefined },
        },
      );
      return res.data.data;
    },
  });
}

/**
 * Chạy dọn rác NGAY (không chờ cron 4h sáng).
 *
 * Dùng cùng logic với cron nên an toàn như nhau: chỉ xoá object `ref_count = 0`
 * VÀ đã quá `graceDays` ngày.
 */
export function useRunStorageGc() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (graceDays: number) => {
      const res = await api.post<{ data: { deleted: number; graceDays: number } }>(
        'admin/storage/gc',
        { graceDays },
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Danh sách + số liệu đổi sau khi dọn -> refetch
      qc.invalidateQueries({ queryKey: STORAGE_OBJECTS_KEY });
    },
  });
}
