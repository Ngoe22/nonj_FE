'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from 'cn';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface SelectOption {
    value: string;
    label: string;
}

interface Props {
    /** Lấy từ `register('field')` — vẫn là form control gốc, không cần Controller */
    register: UseFormRegisterReturn;
    options: SelectOption[];
    className?: string;
}

/**
 * Select giao diện thống nhất với `Input`.
 *
 * Vẫn dùng `<select>` gốc (giữ nguyên `register`, không phải chuyển sang
 * Controller) nhưng bỏ giao diện mặc định của hệ điều hành — thứ trông rất khác
 * nhau giữa các máy — và tự vẽ mũi tên.
 */
export function SelectField({ register, options, className }: Props) {
    return (
        <div className="relative">
            <select
                {...register}
                className={cn(
                    'w-full appearance-none rounded-md border-2 border-status-info bg-surface',
                    'py-2 pl-2 pr-9 text-sm font-medium outline-none transition-colors',
                    'hover:border-status-info/70 focus:border-status-info',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    className,
                )}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            />
        </div>
    );
}
