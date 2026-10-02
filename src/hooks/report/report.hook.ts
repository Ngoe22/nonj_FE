'use client';

import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import type { Report_Reason, Target_Type } from '@/enum/report/report.enum';

/**
 * Gửi báo cáo vi phạm.
 *
 * BE: `POST /report` với `{ target_type, target_id, reason, description }` —
 * target được điền sẵn theo ngữ cảnh, user chỉ chọn lý do + viết mô tả.
 */
export function useCreateReport() {
  return useMutation({
    mutationFn: async (vars: {
      target_type: Target_Type;
      target_id: string;
      reason: Report_Reason;
      description: string;
    }) => {
      await api.post('report', vars);
    },
  });
}
