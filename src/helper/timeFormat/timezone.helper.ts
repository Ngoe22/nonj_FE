export function formatLocalDateTime(
    iso: string | null | undefined,
    locale = 'vi',
): string {
    if (!iso) return '';

    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // Timezone tự detect từ browser
        // timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(date);
}


// vi: 27/09/2026 15:33
// en: 09/27/2026, 03:33 PM