'use client';

import { useState } from 'react';
import {MoreVertical, SaveCheck, SquarePen} from 'lucide-react';

import {
    Group_Join_Mode,
    Group_View_Mode,
} from '@/mock/group';
import SettingSelect from "@/components/group/GroupInner/GroupSettingSelect.compo";
import {useTranslations} from "next-intl";
import {Group} from "@/types/group/group.type";

// interface GroupSettingsProps {
//     group: typeof import('@/mock/group').testGroupData;
// }

export default function GroupSettings(group: Group) {

    const [ info , setInfo ] = useState( {
        name : group.name ,
        description : group.description ,
        join_mode : group.join_mode ,
        view_mode : group.view_mode ,
    } )

    const [ isEditing ,setIsEditing ] = useState(false);

    const txt = useTranslations('Group')

    return (
        <div className="space-y-8 pt-6">
            <section>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {txt('group_information')}
                    </h3>

                    {group.permission.edit_setting && (
                        isEditing ?
                            <button
                                type="button"
                                className="rounded-xl p-2 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                onClick={()=> {
                                    console.log("save")
                                    setIsEditing(false)
                                }
                            }

                            >
                                <SaveCheck size={18} />
                            </button> :

                            <button
                                type="button"
                                className="rounded-xl p-2  text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                                onClick={()=>setIsEditing(!isEditing)}
                            >
                                <SquarePen size={18} />
                            </button>
                    )}
                </div>

                <div className="mt-5 space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {txt('name')}
                        </p>

                        {
                            isEditing ? (
                                <input
                                    className = "mt-3 border-2 p-2 border-blue-300 rounded-xl "
                                    type="text"
                                    value={info.name}
                                    onChange={e => setInfo({ ...info, name: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-sm font-medium">
                                    {info.name}
                                </p>
                            )
                        }
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {txt('description_label')}
                        </p>

                        {
                            isEditing ? (
                                <input
                                    className = "mt-3 border-2 p-2 border-blue-300 rounded-xl "
                                    type="text"
                                    value={info.description}
                                    onChange={e => setInfo({ ...info, name: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-sm font-medium">
                                    {info.description}
                                </p>
                            )
                        }

                    </div>
                </div>
            </section>

            <section className="space-y-5 border-t border-border pt-6">

                    <SettingSelect
                        label={txt('join_mode')}
                        value={info.join_mode}
                        options={Object.values(Group_Join_Mode)}
                        disabled={!isEditing}
                        onChange={(value) =>
                            // setJoinMode(value as Group_Join_Mode)
                            setInfo({ ...info, join_mode: value })
                    }

                    />

                    <SettingSelect
                        label={txt('view_mode')}
                        value={info.view_mode}
                        options={Object.values(Group_View_Mode)}
                        disabled={!isEditing}
                        onChange={(value) =>
                            // setViewMode(value as Group_View_Mode)
                            setInfo({ ...info, view_mode: value })
                        }

                    />



            </section>

        {/*  hidden modal  */}

        </div>
    );
}