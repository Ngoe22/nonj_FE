'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Group_Join_Mode, Group_View_Mode } from '@/enum/group/group_mode.enum';
import SettingSelect from '@/components/group/GroupInner/main/GroupSettingSelect.compo';
import { ActionBtnGroup } from '@/components/_share/about_form/action_btn_group/actionBtnGroup.compo';
import type { Group } from '@/types/group/group.type';
import {InfoAndInput} from "@/components/_share/about_form/info_and_input/infoAndInput.compo";
import {getUpdateGroupDefaults, UpdateGroupFormValues, updateGroupSchema} from "@/schemas/group/update_group.schema";
import {useUpdateGroup} from "@/hooks/group/group_tan.hook";


// ===========================================

interface Props {
    group: Group;
}

const JOIN_MODE_OPTIONS = Object.values(Group_Join_Mode);
const VIEW_MODE_OPTIONS = Object.values(Group_View_Mode);


export default function GroupSettings({ group }: Props) {


    const [isEditing, setIsEditing] = useState(false);
    const txt = useTranslations('Group');

    const defaults = getUpdateGroupDefaults({
        name: group.name,
        description: group.description,
        join_mode: group.join_mode as Group_Join_Mode,
        view_mode: group.view_mode as Group_View_Mode,
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateGroupFormValues>({
        resolver: zodResolver(updateGroupSchema),
        defaultValues: defaults,
        mode: 'onSubmit',
    });

    const joinMode = watch('join_mode');
    const viewMode = watch('view_mode');

    const handleCancel = () => {
        reset(defaults);
        setIsEditing(false);
    };

    const { mutateAsync ,  mutate , isError , isPending } = useUpdateGroup(group.id)

    const submit = handleSubmit(async (body) => {
        await mutateAsync( {id :group.id , body} )
        setIsEditing(false);
    });

    return (
        <div className="space-y-8 pt-6">
            <section>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {txt('group_information')}
                    </h3>
                    <ActionBtnGroup
                        isEditing={isEditing}
                        pending={isPending}
                        onEdit={() => setIsEditing(true)}
                        onConfirm={submit}
                        onCancel={handleCancel}
                    />
                </div>

                <div className="mt-5 space-y-5">
                    {/* Name */}
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {txt('name')}
                        </p>
                        <InfoAndInput
                            isEditing={isEditing}
                            value={group.name}
                            register={register('name')}
                            error={errors.name}
                            placeholder={txt('create_group_name_placeholder')}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {txt('description_label')}
                        </p>
                        <InfoAndInput
                            isEditing={isEditing}
                            value={group.description ?? ''}
                            register={register('description')}
                            error={errors.description}
                            type="textarea"
                            placeholder={txt('create_group_description_placeholder')}
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-5 border-t border-border pt-6">
                <SettingSelect
                    label={txt('join_mode')}
                    value={joinMode}
                    options={JOIN_MODE_OPTIONS}
                    disabled={!isEditing}
                    error={errors.join_mode}
                    onChange={(v) => setValue('join_mode', v as Group_Join_Mode)}
                />

                <SettingSelect
                    label={txt('view_mode')}
                    value={viewMode}
                    options={VIEW_MODE_OPTIONS}
                    disabled={!isEditing}
                    error={errors.view_mode}
                    onChange={(v) => setValue('view_mode', v as Group_View_Mode)}
                />
            </section>
        </div>
    );
}