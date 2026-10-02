'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/axios/axios';
import { getBeUrl } from '@/lib/api/beUrl';
import {
  ADMIN_ENDPOINT,
  adminDeletePath,
  adminRestorePath,
  type AdminPage,
  type AdminQuery,
  type AdminResource,
} from '@/types/admin/admin.type';

export const ADMIN_PAGE_SIZE = 20;

/** Bỏ các tham số rỗng để URL gọn và cache key ổn định */
export function buildAdminParams(query: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return params.toString();
}

// ============================================================
// DANH SÁCH + KHÔI PHỤC — dùng chung cho cả 6 mục
// ============================================================

/**
 * Danh sách cho MỌI mục admin.
 *
 * BE trả `{ items, total, page, limit }` nên `total` có thật, phân trang đúng
 * (trước đây BE trả mảng trần nên không biết tổng bao nhiêu bản ghi).
 */
export function useAdminList<T>(resource: AdminResource, query: AdminQuery) {
  const qs = buildAdminParams(query as Record<string, unknown>);

  return useQuery<AdminPage<T>>({
    queryKey: ['admin', resource, qs],
    queryFn: async () => {
      const res = await api.get(`${ADMIN_ENDPOINT[resource]}?${qs}`);
      return res.data.data;
    },
    placeholderData: (previous) => previous,
  });
}

/** Khôi phục bản ghi đã bị xoá mềm */
export function useAdminRestore(resource: AdminResource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const path = adminRestorePath(resource, id);
      if (!path) throw new Error('resource_not_restorable');
      await api.patch(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] });
    },
  });
}

/**
 * Xoá mềm một bản ghi.
 *
 * `user` trả về `null` ở `adminDeletePath` nên mutation sẽ báo lỗi — với người
 * dùng phải dùng khoá/mở khoá (`useAdminUpdateUser`).
 */
export function useAdminSoftDelete(resource: AdminResource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const path = adminDeletePath(resource, id);
      if (!path)
        throw new Error(`resource_khong_ho_tro_xoa_mem:${resource}`);
      await api.delete(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', resource] });
    },
  });
}

// ============================================================
// SỬA TỪNG LOẠI
// ============================================================

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      user_id: string;
      body: Record<string, unknown>;
    }) => {
      const res = await api.patch(`admin/users/${vars.user_id}`, vars.body);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'user'] }),
  });
}

export function useAdminUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      group_id: string;
      body: Record<string, unknown>;
    }) => {
      await api.patch(`admin/group/${vars.group_id}`, vars.body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'group'] }),
  });
}

export function useAdminUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      post_id: string;
      body: Record<string, unknown>;
    }) => {
      await api.patch(`admin/post/${vars.post_id}`, vars.body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'post'] }),
  });
}

export function useAdminUpdatePreparation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      user_id: string;
      preparation_id: string;
      body: Record<string, unknown>;
    }) => {
      await api.patch(
        `admin/question_preparation/${vars.user_id}/${vars.preparation_id}`,
        vars.body,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'preparation'] }),
  });
}

export function useAdminReviewReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      report_id: string;
      body: Record<string, unknown>;
    }) => {
      await api.patch(`admin/report/${vars.report_id}/review`, vars.body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'report'] }),
  });
}

// ============================================================
// DRILL-DOWN (bấm từ bảng đi sâu vào dữ liệu liên quan)
// ============================================================

/** Bộ sưu tập đề cá nhân của một người dùng */
export function useAdminUserCollections(user_id: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'user_collections', user_id],
    enabled: enabled && !!user_id,
    queryFn: async () => {
      const res = await api.get(
        `admin/question_preparation_collection/user/${user_id}`,
      );
      return res.data.data;
    },
  });
}

/** Đề trong 1 bộ sưu tập của 1 người */
export function useAdminCollectionPreparations(
  user_id: string,
  collection_id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['admin', 'collection_preparations', user_id, collection_id],
    enabled: enabled && !!user_id && !!collection_id,
    queryFn: async () => {
      const res = await api.get(
        `admin/question_preparation/users/${user_id}/${collection_id}?page=1&limit=100`,
      );
      return res.data.data;
    },
  });
}

/** Bộ sưu tập bài tập của một nhóm */
export function useAdminGroupCollections(group_id: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'group_collections', group_id],
    enabled: enabled && !!group_id,
    queryFn: async () => {
      const res = await api.get(`admin/post_collection/group/${group_id}`);
      return res.data.data;
    },
  });
}

/** Bạn bè của một người dùng (tab trong trang quan hệ) */
export function useAdminUserFriends(user_id: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'user_friends', user_id],
    enabled: enabled && !!user_id,
    queryFn: async () => {
      const res = await api.get(`admin/friendship/${user_id}`);
      return res.data.data;
    },
  });
}

/** Lời mời kết bạn ĐẾN một người dùng */
export function useAdminUserIngoing(user_id: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'user_ingoing', user_id],
    enabled: enabled && !!user_id,
    queryFn: async () => {
      const res = await api.get(
        `admin/friend_request/${user_id}/ingoing?page=1&limit=50`,
      );
      return res.data.data;
    },
  });
}

/** Lời mời kết bạn do một người dùng GỬI ĐI */
export function useAdminUserOutgoing(user_id: string, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'user_outgoing', user_id],
    enabled: enabled && !!user_id,
    queryFn: async () => {
      const res = await api.get(
        `admin/friend_request/${user_id}/outgoing?page=1&limit=50`,
      );
      return res.data.data;
    },
  });
}

/**
 * Reset mật khẩu của user — admin KHÔNG nhập mật khẩu, chỉ bấm nút và BE sinh
 * mật khẩu mới rồi GỬI QUA EMAIL.
 */
export function useAdminResetPassword() {
  return useMutation({
    mutationFn: async (user_id: string) => {
      await api.patch(`admin/users/${user_id}/reset_password`);
    },
  });
}

/**
 * Xoá mềm quan hệ bạn bè.
 *
 * KHÁC các mục khác: BE nhận cặp `user_id` + `friend_id` qua DELETE body (vì
 * quan hệ 2 chiều lưu 2 dòng), không xoá theo id.
 */
export function useAdminDeleteFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { user_id: string; friend_id: string }) => {
      await api.delete('admin/friendship', { data: vars });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'friendship'] }),
  });
}

/** Duyệt / từ chối yêu cầu tham gia nhóm (admin) */
export function useAdminUpdateJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      join_request_id: string;
      status: 'APPROVED' | 'REJECTED';
    }) => {
      await api.patch(`admin/group_join_request/${vars.join_request_id}`, {
        status: vars.status,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'join_request'] }),
  });
}

/** Xoá CỨNG một yêu cầu tham gia nhóm (không phải xoá mềm) */
export function useAdminDeleteJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (join_request_id: string) => {
      await api.delete(`admin/group_join_request/${join_request_id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'join_request'] }),
  });
}

/** Nâng quyền user lên SYSTEM_ADMIN (endpoint riêng, không lẫn vào edit info) */
export function useAdminPromote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      await api.patch(`admin/users/${user_id}/promote`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'user'] }),
  });
}

/** Hạ quyền SYSTEM_ADMIN về USER thường */
export function useAdminDemote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      await api.patch(`admin/users/${user_id}/demote`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'user'] }),
  });
}

// ============================================================
// SỐ NGƯỜI ĐANG ONLINE
// ============================================================

/**
 * Số người đang online.
 *
 * Lấy giá trị đầu qua REST (`GET /admin/online`) rồi CẬP NHẬT LIÊN TỤC qua
 * WebSocket — không polling. Chỉ SYSTEM_ADMIN được vào phòng `admin` ở BE nên
 * người dùng thường không nhận được sự kiện này.
 */
export function useAdminOnlineCount() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    api
      .get('admin/online')
      .then((res) => {
        if (active) setTotal(res.data.data?.total ?? 0);
      })
      .catch(() => {
        if (active) setTotal(null);
      });

    const baseUrl = getBeUrl();

    const socket = io(`${baseUrl}/notif`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      // hoãn kết nối 1 nhịp — tránh cảnh báo do StrictMode mount 2 lần
      autoConnect: false,
    });

    socket.on('online_count', (payload: { total?: number }) => {
      if (active) setTotal(payload?.total ?? 0);
    });

    const timer = setTimeout(() => socket.connect(), 0);

    return () => {
      active = false;
      clearTimeout(timer);
      socket.disconnect();
    };
  }, []);

  return total;
}
