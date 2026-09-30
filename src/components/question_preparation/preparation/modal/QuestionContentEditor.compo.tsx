'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import type { QuestionPreparationFormValues } from '@/schemas/question_preparation/question_preparation.schema';
import { FileUploadButton } from '@/components/_share/upload/UploadFileBtn.compo';

interface Props {
    /** Đường dẫn tới content trong form — vd: `sections.0.content` */
    namePrefix: `sections.${number}.content`;
}

export function QuestionContentEditor({ namePrefix }: Props) {
    const txt = useTranslations('Question_builder');
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<QuestionPreparationFormValues>();

    const imgUrl = watch(`${namePrefix}.img_url`) as string | undefined;
    const mp3Url = watch(`${namePrefix}.mp3_url`) as string | undefined;

    const sectionsErrors = errors.sections as any;
    const sectionIndex = parseInt(namePrefix.split('.')[1], 10);
    const contentErrors = sectionsErrors?.[sectionIndex]?.content;

    return (
        <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
            <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {txt('content_text')}
                </label>
                <Input
                    register={register(`${namePrefix}.text`)}
                    error={contentErrors?.text}
                    type="textarea"
                    placeholder={txt('content_text_placeholder')}
                    inputStyles="mt-1 w-full rounded-md border-2 border-status-info p-2 text-sm min-h-[80px] resize-y"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <FileUploadButton
                    fileType="image"
                    value={imgUrl}
                    onChange={(url) =>
                        setValue(`${namePrefix}.img_url`, url ?? '', {
                            shouldDirty: true,
                        })
                    }
                />
                <FileUploadButton
                    fileType="audio"
                    value={mp3Url}
                    onChange={(url) =>
                        setValue(`${namePrefix}.mp3_url`, url ?? '', {
                            shouldDirty: true,
                        })
                    }
                />
            </div>
        </div>
    );
}
