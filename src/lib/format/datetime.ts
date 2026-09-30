/** ISO string -> giá trị cho <input type="datetime-local"> (giờ địa phương) */
export function toDateTimeLocal(iso: string | null | undefined): string {
    if (!iso) return '';

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';

    const pad = (value: number) => String(value).padStart(2, '0');

    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
}

/** Hiển thị ngày giờ đầy đủ, kèm nhãn khi đã quá hạn */
export function formatDeadline(iso: string | null | undefined): string | null {
    if (!iso) return null;

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;

    const pad = (value: number) => String(value).padStart(2, '0');

    return (
        `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}` +
        ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
}
