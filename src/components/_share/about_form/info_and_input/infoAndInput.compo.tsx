import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import {InvalidInput} from "@/components/_share/form_error_warning/FormErrorWarning.compo";

interface Props {
    isEditing: boolean;
    value: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    type?: 'input' | 'textarea';
    placeholder?: string;
    infoStyle?: string;
}

export function InfoAndInput({
                                 isEditing,
                                 value,
                                 register,
                                 error,
                                 type = 'input',
                                 placeholder,
                                infoStyle
                             }: Props) {
    const commonClass =
        'mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info';

    return (
        <div>
            {isEditing ? (
                <div>
                    {type === 'textarea' ? (
                        <textarea
                            {...register}
                            placeholder={placeholder}
                            className={commonClass}
                        />
                    ) : (
                        <input
                            {...register}
                            placeholder={placeholder}
                            className={commonClass}
                        />
                    )}
                    {error && <InvalidInput msg={error.message} />}
                </div>
            ) : (
                <p className={ infoStyle ? infoStyle : "mt-2 text-sm font-medium"  }>
                    {value}
                </p>
            )}
        </div>
    );
}