'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

import {
    Group_Join_Mode,
    Group_View_Mode,
} from '@/mock/group';
import SettingSelect from "@/components/group/GroupSettingSelect.compo";

interface GroupSettingsProps {
    group: typeof import('@/mock/group').testGroupData;
}

export default function GroupSettings({
                                          group,
                                      }: GroupSettingsProps) {
    const [joinMode, setJoinMode] = useState(
        group.join_mode
    );

    const [viewMode, setViewMode] = useState(
        group.view_mode
    );

    return (
        <div className="space-y-8 pt-6">
            <section>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Group information
                    </h3>

                    {group.permission.edit_setting && (
                        <button
                            type="button"
                            className="rounded-xl p-2 text-muted hover:bg-surface-hover hover:text-foreground"
                        >
                            <MoreVertical size={18} />
                        </button>
                    )}
                </div>

                <div className="mt-5 space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted">
                            Name
                        </p>

                        <p className="mt-1 text-sm font-medium">
                            {group.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-muted">
                            Description
                        </p>

                        <p className="mt-1 text-sm">
                            {group.description}
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-5 border-t border-border pt-6">

                    <SettingSelect
                        label="Join mode"
                        value={joinMode}
                        options={Object.values(Group_Join_Mode)}
                        disabled={!group.permission.edit_setting}
                        onChange={(value) =>
                            setJoinMode(value as Group_Join_Mode)
                        }
                    />

                    <SettingSelect
                        label="View mode"
                        value={viewMode}
                        options={Object.values(Group_View_Mode)}
                        disabled={!group.permission.edit_setting}
                        onChange={(value) =>
                            setViewMode(value as Group_View_Mode)
                        }
                    />



            </section>
        </div>
    );
}