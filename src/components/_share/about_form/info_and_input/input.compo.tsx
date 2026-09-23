import {FieldError, UseFormRegisterReturn} from "react-hook-form";
import {InvalidInput} from "@/components/_share/form_error_warning/FormErrorWarning.compo";

interface Props {
    register: UseFormRegisterReturn;
    error?: FieldError;
    type?: 'input' | 'textarea';
    placeholder?: string;
    inputStyles?: string;
}

export function Input ({ register ,error , type , placeholder ,inputStyles} :Props) {


    const commonClass =
        'mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info';

    return (
        <div>
            <div>
                {type === 'textarea' ? (
                    <textarea
                        {...register}
                        placeholder={placeholder}
                        className={ inputStyles ? inputStyles : commonClass  }
                    />
                ) : (
                    <input
                        {...register}
                        placeholder={placeholder}
                        className={inputStyles ? inputStyles : commonClass }
                    />
                )}
                {error && <InvalidInput msg={error.message} />}
            </div>
        </div>
    );
}