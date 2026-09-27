'use client';

import { useTranslations } from 'next-intl';

export function useRelativeTime() {
    const txt = useTranslations('Time');

    return (iso: string | null | undefined): string => {
        if (!iso) return '';

        const date = new Date(iso);
        if (isNaN(date.getTime())) return '';

        const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

        // Tương lai
        if (diffSec < 0) {
            const abs = Math.abs(diffSec);
            if (abs < 60) return txt('in_seconds', { count: abs });
            if (abs < 3600) return txt('in_minutes', { count: Math.floor(abs / 60) });
            if (abs < 86400) return txt('in_hours', { count: Math.floor(abs / 3600) });
            return txt('in_days', { count: Math.floor(abs / 86400) });
        }

        // Quá khứ
        if (diffSec < 10) return txt('just_now');
        if (diffSec < 60) return txt('seconds_ago', { count: diffSec });

        const min = Math.floor(diffSec / 60);
        if (min < 60) return txt('minutes_ago', { count: min });

        const hour = Math.floor(min / 60);
        if (hour < 24) return txt('hours_ago', { count: hour });

        const day = Math.floor(hour / 24);
        if (day === 1) return txt('yesterday');
        if (day < 7) return txt('days_ago', { count: day });

        const week = Math.floor(day / 7);
        if (week < 4) return txt('weeks_ago', { count: week });

        const month = Math.floor(day / 30);
        if (month < 12) return txt('months_ago', { count: month });

        const year = Math.floor(day / 365);
        return txt('years_ago', { count: year });
    };
}