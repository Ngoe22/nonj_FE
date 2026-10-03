'use client';

import { useEffect, useRef } from 'react';

/**
 * Nạp lại form mỗi khi modal MỞ — nhưng **cắt cơn lặp vô hạn** của `reset()`.
 *
 * ## Vì sao cần hook này
 *
 * `react-hook-form` trả `reset` là **arrow function khai báo thẳng trong
 * `useForm`**, KHÔNG bọc `useCallback` (xem `dist/index.cjs.js`: `reset: Be` với
 * `Be = (e, t) => Ue(...)`). Nên `reset` **đổi identity mỗi lần render**.
 *
 * Cách viết cũ:
 * ```tsx
 * useEffect(() => {
 *     if (open) reset(initialValues);
 * }, [open, initialValues, reset]);   // ⚠️ reset đổi mỗi render
 * ```
 *
 * -> effect chạy **MỖI LẦN RENDER** -> `reset()` liên tục -> **form state luôn
 * quay về rỗng trong khi DOM (uncontrolled input) vẫn giữ chữ người dùng gõ**.
 * Hệ quả người dùng thấy: ô đã có chữ mà vẫn báo *"Vui lòng nhập nội dung"*,
 * và gõ bao nhiêu cũng không lưu được.
 *
 * Hook này chỉ gọi `reset` khi **mở modal** hoặc khi **giá trị khởi tạo thật sự
 * đổi** (trường hợp Sửa: dữ liệu về sau), và giữ `reset` trong ref nên không phụ
 * thuộc vào identity của nó.
 *
 * ## Cách dùng
 * ```tsx
 * const form = useForm({ defaultValues });
 * useResetWhenOpen(open, initialValues, form.reset);
 * ```
 */
export function useResetWhenOpen<T>(
    open: boolean,
    values: T,
    reset: (values: T) => void,
) {
    /**
     * "Dấu vân tay" của bộ giá trị khởi tạo.
     *
     * Dùng `JSON.stringify` để so SÁNH THEO NỘI DUNG, không theo tham chiếu —
     * nhờ vậy object literal tạo mới mỗi render (lỗi rất dễ mắc ở component cha)
     * vẫn KHÔNG làm reset chạy lại.
     */
    const key = JSON.stringify(values ?? null);

    const lastKeyRef = useRef<string | null>(null);
    const resetRef = useRef(reset);
    const valuesRef = useRef(values);

    // Cập nhật ref SAU mỗi render (không gán trong lúc render — vi phạm react-hooks/refs)
    useEffect(() => {
        resetRef.current = reset;
        valuesRef.current = values;
    });

    useEffect(() => {
        if (!open) {
            // Đóng modal -> quên dấu vân tay để lần mở sau reset lại từ đầu
            lastKeyRef.current = null;
            return;
        }

        if (lastKeyRef.current === key) return; // đã nạp đúng bộ này rồi
        lastKeyRef.current = key;
        resetRef.current(valuesRef.current);
    }, [open, key]);
}
