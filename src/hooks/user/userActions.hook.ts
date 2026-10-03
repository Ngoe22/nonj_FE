'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import type { AuthUserInfo } from '@/types/auth/auth.type';

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

/**
 * Đặt mật khẩu LẦN ĐẦU — chỉ cho tài khoản Google chưa có mật khẩu.
 *
 * `POST /user/set_password` trả về `getMyInfo` (đúng shape `GET /user/me`), nên
 * ghi thẳng vào cache `['my_profile']` — `has_password` thành `true` và UI đổi
 * sang "Đổi mật khẩu" NGAY, không chờ refetch.
 */
export function useSetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (new_password: string) => {
      const res = await api.post<{ data: AuthUserInfo }>('user/set_password', {
        new_password,
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(['my_profile'], data);
      queryClient.invalidateQueries({ queryKey: ['my_profile'] });
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
    onSuccess: (data) => {
      /**
       * Ghi NGAY user mới vào cache thay vì chỉ `invalidateQueries`.
       *
       * `invalidateQueries` chỉ ĐÁNH DẤU cache cũ là stale rồi refetch ở NỀN —
       * nghĩa là trong lúc đó `useGetMyProfile` vẫn trả `user_name = null`.
       * `HomeLayout` có guard "chưa có username thì đá về /username", nên nó đọc
       * phải cache cũ và đá ngược lại — đúng lỗi "đăng ký username xong vẫn còn
       * modal".
       *
       * `setQueryData` là đồng bộ nên chạy xong trước khi `mutateAsync` resolve,
       * tức là trước khi `router.replace('/')` ở UsernameSetup.
       *
       * Response `POST /user/username` có ĐÚNG shape của `GET /user/me` (cả hai
       * đều đi qua `getMyInfo`) nên ghi thẳng vào cache được.
       */
      if (data) queryClient.setQueryData(['my_profile'], data);

      queryClient.invalidateQueries({ queryKey: ['my_profile'] });
    },
  });
}

/**
 * Reset mật khẩu CỦA CHÍNH MÌNH.
 *
 * `POST /auth/reset_password` (cần đang đăng nhập) sẽ: sinh mật khẩu mới → gửi
 * vào email → **thu hồi toàn bộ phiên** trên mọi thiết bị. Vì vậy sau khi gọi
 * thành công, FE phải đưa người dùng về trang đăng nhập.
 */
export function useResetMyPassword() {
  return useMutation({
    mutationFn: async () => {
      await api.post('auth/reset_password');
    },
  });
}
