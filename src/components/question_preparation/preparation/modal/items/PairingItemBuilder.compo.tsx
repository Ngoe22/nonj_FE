'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import { RemoveIconButton } from '@/components/_share/icon_button/RemoveIconButton.compo';
import { InvalidInput } from '@/components/_share/form_error_warning/FormErrorWarning.compo';
import { translateErrorKey } from '@/helper/formError/formError.helper';

interface Props {
    sectionIndex: number;
    itemIndex: number;
}

interface Pair {
    key: string;
    value: string;
}

const MIN_PAIRS = 2;
const MAX_PAIRS = 20;

const inputStyles =
    'flex-1 min-w-0 rounded-md border-2 border-status-info p-2 text-sm';

/**
 * Soạn câu "nối cặp".
 *
 * Controlled + `useWatch`: `pairs` là mảng object nên càng dễ lệch giá trị khi
 * thêm/xoá giữa danh sách nếu dùng input uncontrolled.
 */
export function PairingItemBuilder({ sectionIndex, itemIndex }: Props) {
    const txt = useTranslations('Question_builder');
    const txtErr = useTranslations('Shema');
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<any>();

    const basePath = `sections.${sectionIndex}.items.${itemIndex}`;
    const pairsPath = `${basePath}.pairs`;

    const watched = useWatch({ control, name: pairsPath });
    const pairs: Pair[] = Array.isArray(watched) ? watched : [];

    const itemErrors = (errors.sections as any)?.[sectionIndex]?.items?.[
        itemIndex
    ];

    /** Lỗi nằm ở `pairs[index].key` / `pairs[index].value` */
    const pairError = (index: number, side: 'key' | 'value'): string | undefined => {
        const err = itemErrors?.pairs;
        if (!Array.isArray(err)) return undefined;
        return err[index]?.[side]?.message;
    };

    const write = (next: Pair[]) =>
        setValue(pairsPath, next, { shouldDirty: true });

    const changePair = (index: number, patch: Partial<Pair>) =>
        write(
            pairs.map((pair, i) =>
                i === index ? { ...pair, ...patch } : pair,
            ),
        );

    const addPair = () => write([...pairs, { key: '', value: '' }]);

    const removePair = (index: number) =>
        write(pairs.filter((_, i) => i !== index));

    return (
        <div className="space-y-2 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
                {txt('pairing_pairs')}
            </p>

            {pairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <Input
                            value={pair?.key ?? ''}
                            onChange={(e) =>
                                changePair(index, { key: e.target.value })
                            }
                            placeholder={txt('pair_left')}
                            inputStyles={inputStyles}
                        />
                        {pairError(index, 'key') && (
                            <p className="mt-1 text-xs text-destructive">
                                {translateErrorKey(
                                    txtErr,
                                    pairError(index, 'key')!,
                                )}
                            </p>
                        )}
                    </div>
                    <span className="shrink-0 text-muted-foreground">→</span>
                    <div className="min-w-0 flex-1">
                        <Input
                            value={pair?.value ?? ''}
                            onChange={(e) =>
                                changePair(index, { value: e.target.value })
                            }
                            placeholder={txt('pair_right')}
                            inputStyles={inputStyles}
                        />
                        {pairError(index, 'value') && (
                            <p className="mt-1 text-xs text-destructive">
                                {translateErrorKey(
                                    txtErr,
                                    pairError(index, 'value')!,
                                )}
                            </p>
                        )}
                    </div>
                    {pairs.length > MIN_PAIRS && (
                        <RemoveIconButton
                            onClick={() => removePair(index)}
                            label={txt('remove')}
                        />
                    )}
                </div>
            ))}

            <InvalidInput msg={itemErrors?.pairs?.message} />

            {pairs.length < MAX_PAIRS && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPair}
                    className="gap-2"
                >
                    <Plus size={13} />
                    {txt('add_pair')}
                </Button>
            )}
        </div>
    );
}
