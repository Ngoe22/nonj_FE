import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios/axios';
import { PUBLIC_CONFIG_KEY } from './use_get_media_limits.hook';

/** Toàn bộ cấu hình admin đọc/sửa được (giá trị luôn là chuỗi ở dạng thô) */
export interface AdminConfig {
  post_max_images: string;
  post_max_audio: string;
  home_text: string;
  contact_facebook: string;
  contact_email: string;
  auth_image_url: string;
  favicon_url: string;
}

interface UpdateConfigResult {
  success: boolean;
  config?: AdminConfig;
  errorCode?: string;
}

export interface UpdateConfigVars {
  key: keyof AdminConfig;
  value: string | number;
}

/** Đọc + cập nhật cấu hình hệ thống (chỉ admin) */
export function useAdminConfig() {
  const qc = useQueryClient();

  const query = useQuery<AdminConfig>({
    queryKey: ['admin_config'],
    queryFn: async () => {
      const res = await api.get<{ data: AdminConfig }>('admin/config');
      return res.data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (input: UpdateConfigVars) => {
      const res = await api.patch<{ data: UpdateConfigResult }>(
        'admin/config',
        input,
      );
      return res.data.data;
    },
    onSuccess: (res) => {
      if (res?.config) qc.setQueryData(['admin_config'], res.config);
      // Giới hạn ảnh/mp3 + nội dung trang chủ đều nằm trong `/config` công khai
      // -> phải làm mới để editor và trang chủ nhận giá trị mới.
      qc.invalidateQueries({ queryKey: PUBLIC_CONFIG_KEY });
    },
  });

  return { query, mutation };
}
