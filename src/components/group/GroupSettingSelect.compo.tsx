'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface SettingSelectProps<T extends string> {
    label: string;
    value: T;
    options: readonly T[];
    disabled?: boolean;
    onChange: (value: T) => void;
}

export default function SettingSelect<T extends string>({
                                                            label,
                                                            value,
                                                            options,
                                                            disabled = false,
                                                            onChange,
                                                        }: SettingSelectProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-foreground">
                {label}
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={`
                    flex w-full items-center justify-between
                    rounded-xl border border-border
                    bg-surface
                    px-4 py-3
                    text-left
                    transition
                    ${
                    disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:border-border-strong'
                }
                `}
            >
                <span className="text-sm font-medium text-foreground">
                    {value}
                </span>

                <ChevronDown
                    size={17}
                    className={`text-muted transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && !disabled && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg">
                    {options.map((option) => {
                        const selected = option === value;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                                className={`
                                    flex w-full items-center justify-between
                                    rounded-lg px-3 py-2.5
                                    text-sm
                                    transition
                                    ${
                                    selected
                                        ? 'bg-surface-hover font-medium text-foreground'
                                        : 'text-muted hover:bg-surface-hover hover:text-foreground'
                                }
                                `}
                            >
                                <span>{option}</span>

                                {selected && (
                                    <Check
                                        size={16}
                                        className="text-foreground"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}