import type { FieldErrors } from 'react-hook-form';

/**
 * Gom toàn bộ message lỗi trong cây `errors` của react-hook-form.
 *
 * Message của zod trong dự án này là KEY i18n (vd 'enter_something'), nên chỉ
 * cần gom key rồi dịch ở tầng hiển thị.
 *
 * Dùng để hiện bảng tóm tắt "còn thiếu gì" — trước đây lỗi ở cấp mảng (vd
 * `sections`) không được render nên bấm xác nhận mà KHÔNG thấy cảnh báo gì.
 */
export function collectErrorKeys(errors: unknown): string[] {
    const found: string[] = [];
    const seen = new Set<unknown>();

    const walk = (node: unknown) => {
        if (!node || typeof node !== 'object') return;

        // tránh đi vào DOM node (react-hook-form gắn `ref` vào errors)
        if (seen.has(node)) return;
        seen.add(node);

        const record = node as Record<string, unknown>;

        if (typeof record.message === 'string' && record.message) {
            found.push(record.message);
        }

        for (const [key, value] of Object.entries(record)) {
            if (key === 'message' || key === 'type' || key === 'ref') continue;
            walk(value);
        }
    };

    walk(errors);
    return [...new Set(found)];
}

/** Đếm số field đang lỗi (đã loại trùng message) */
export function countErrorKeys(errors: FieldErrors | undefined): number {
    return collectErrorKeys(errors).length;
}

/**
 * Dịch một message lỗi sang câu hiển thị.
 *
 * KHÔNG phải message nào cũng là key i18n: message do zod tự sinh (vd lỗi kiểu
 * dữ liệu) là câu tiếng Anh thật. Vì vậy phải chịu được trường hợp không có key
 * — nếu để next-intl ném lỗi thì cả form trắng xoá ngay khi có lỗi lạ.
 */
export function translateErrorKey(
    txt: (key: string) => string,
    key: string,
): string {
    try {
        return txt(key);
    } catch {
        return key;
    }
}
