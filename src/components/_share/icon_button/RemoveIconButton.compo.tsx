'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';

interface Props {
    onClick: () => void;
    /** Chữ hiện khi rê chuột + cho screen reader */
    label?: string;
    /** Đổi icon (mặc định dấu X) */
    icon?: ReactNode;
    /**
     * Bo góc cho KHỚP khối bên cạnh. Ô nhập trong app dùng `rounded-md`,
     * nên mặc định cũng là `rounded-md`.
     */
    className?: string;
    disabled?: boolean;
}

/**
 * Nút xoá dùng chung.
 *
 * Mặc định MỜ (không đỏ) để không phá thị giác của form; chỉ khi rê chuột mới
 * chuyển sang đỏ. Trước đây các builder để `text-red-600` mặc định nên nhìn rất
 * nặng và làm người dùng tưởng là hành động nguy hiểm.
 */
export function RemoveIconButton({
    onClick,
    label,
    icon,
    className,
    disabled,
}: Props) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={cn(
                'h-9 w-9 shrink-0 rounded-md text-muted-foreground/45 transition-colors',
                'hover:bg-destructive/10 hover:text-destructive',
                'disabled:pointer-events-none disabled:opacity-40',
                className,
            )}
        >
            {icon ?? <X size={15} />}
        </Button>
    );
}
