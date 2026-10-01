'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';

/**
 * Check username đã bị dùng chưa.
 *
 * BE trả `true` (đã tồn tại) hoặc `null` (chưa dùng) — nên phải so `=== true`,
 * không chỉ truthy/falsy.
 */
export function useCheckUsername() {
  return useMutation({
    mutationFn: async (user_name: string) => {
      const res = await api.post(`user/check_existing/${user_name}`);
      return res.data.data === true;
    },
  });
}

/** Check slug nhóm đã bị dùng chưa */
export function useCheckSlug() {
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.post(`group/check_existing/${slug}`);
      return res.data.data === true;
    },
  });
}

/** Tự đổi mật khẩu — bắt buộc mật khẩu cũ */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (vars: { old_password: string; new_password: string }) => {
      await api.post('user/change_password', vars);
    },
  });
}

/** Chọn username (tài khoản Google mới chưa có) */
export function useSetUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_name: string) => {
      const res = await api.post('user/username', { user_name });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_profile'] });
    },
  });
}
