import {
    FieldError,
    UseFormRegisterReturn,
} from 'react-hook-form';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';

interface BaseProps {
    error?: FieldError;
    type?: 'input' | 'textarea' | 'number';
    placeholder?: string;
    inputStyles?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    className?: string;
}

/** Chế độ 1 — uncontrolled, dùng register */
interface RegisterMode extends BaseProps {
    register: UseFormRegisterReturn;
    value?: never;
    onChange?: never;
}

/** Chế độ 2 — controlled, dùng value + onChange */
interface ControlledMode extends BaseProps {
    register?: never;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

type Props = RegisterMode | ControlledMode;

export function Input(props: Props) {
    const {
        error,
        type = 'input',
        placeholder,
        inputStyles,
        min,
        max,
        step,
        disabled,
        className,
    } = props;

    const commonClass =
        'mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info';
    const finalClass = [inputStyles ?? commonClass, className]
        .filter(Boolean)
        .join(' ');

    // ✅ Build props chung cho input/textarea
    const sharedProps = {
        placeholder,
        className: finalClass,
        disabled,
        ...(props.register
            ? props.register
            : { value: props.value, onChange: props.onChange }),
    };

    return (
        <div>
            <div>
                {type === 'textarea' ? (
                    <textarea {...sharedProps} />
                ) : (
                    <input
                        {...sharedProps}
                        type={type === 'number' ? 'number' : 'text'}
                        min={min}
                        max={max}
                        step={step}
                    />
                )}
                {error && <InvalidInput msg={error.message} />}
            </div>
        </div>
    );
}