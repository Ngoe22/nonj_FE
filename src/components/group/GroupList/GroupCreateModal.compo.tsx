'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

import {
    createGroupSchema,
    createGroupDefaultValues,
    type CreateGroupFormValues,
} from '@/schemas/group/group.schema';
import { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';
import { Input } from '@/components/_share/about_form/info_and_input/input.compo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// =================================================

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateGroupFormValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export function CreateGroupModal({open, onClose, onSubmit, isSubmitting = false }: Props) {
    const txt = useTranslations('Group');

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm<CreateGroupFormValues>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: createGroupDefaultValues,
        mode: 'onSubmit',
    });

    useEffect(() => {
        if (!open) reset(createGroupDefaultValues);
    }, [open, reset]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    const handleClose = () => {
        if (isSubmitting) return;
        if (isDirty && !confirm(txt('create_group_confirm_discard'))) return;
        onClose();
    };

    const submit
        = handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        {txt('create_group_modal_title')}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-hover disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium">
                            {txt('create_group_label_name')}
                        </label>
                        <Input
                            register={register('name')}
                            error={errors.name}
                            placeholder={txt('create_group_name_placeholder')}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-sm font-medium">
                            {txt('create_group_label_slug')}
                        </label>
                        <Input
                            register={register('slug')}
                            error={errors.slug}
                            placeholder={txt('create_group_slug_placeholder')}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">
                            {txt('create_group_label_description')}
                        </label>
                        <Input
                            register={register('description')}
                            error={errors.description}
                            type="textarea"
                            placeholder={txt('create_group_description_placeholder')}
                            inputStyles="mt-1 text-sm font-medium rounded-md p-2 w-full border-2 border-status-info min-h-[100px] resize-y"
                        />
                    </div>

                    {/* ============ Join Mode ============ */}
                    <div>
                        <label className="text-sm font-medium">
                            {txt('create_group_join_mode')}
                        </label>
                        <Controller
                            control={control}          // ⬅️ SỬA: form.control → control
                            name="join_mode"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? undefined}
                                >
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Group_Join_Mode.PUBLIC}>
                                            {txt('create_group_join_mode_public')}
                                        </SelectItem>
                                        <SelectItem value={Group_Join_Mode.BY_REQUEST}>
                                            {txt('create_group_join_mode_private')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.join_mode && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.join_mode.message}
                            </p>
                        )}
                    </div>

                    {/* ============ View Mode  ============ */}
                    <div>
                        <label className="text-sm font-medium">
                            {txt('create_group_view_mode')}
                        </label>
                        <Controller
                            control={control}
                            name="view_mode"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value ?? undefined}
                                >
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Group_View_Mode.PUBLIC}>
                                            {txt('create_group_view_mode_public')}
                                        </SelectItem>
                                        <SelectItem value={Group_View_Mode.PRIVATE}>
                                            {txt('create_group_view_mode_private')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.view_mode && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.view_mode.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-surface-hover disabled:opacity-50"
                        >
                            {txt('create_group_cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? txt('create_group_creating')
                                : txt('create_group_create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}