'use client';

import { useTranslations } from 'next-intl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FieldError } from 'react-hook-form';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';



interface Props {
    label: string;
    value: string;
    options: string[];
    disabled?: boolean;
    error?: FieldError;
    onChange: (value: string) => void;
}

export default function SettingSelect({
                                          label,
                                          value,
                                          options,
                                          disabled = false,
                                          error,
                                          onChange,
                                      }: Props) {
    const txt = useTranslations('Group');



    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </p>

            {disabled ? (
                <p className="mt-2 text-sm font-medium">
                    {txt(value as string)}
                </p>
            ) : (
                <>
                    <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="mt-2 w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {txt(opt)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && <InvalidInput msg={txt(error.message as any)} />}
                </>
            )}
        </div>
    );
}