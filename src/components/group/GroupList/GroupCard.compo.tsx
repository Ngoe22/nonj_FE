'use client';

import { Users } from 'lucide-react';
import {useRouter} from "@/i18n/navigation";
import {Group} from "@/types/group/group.type";
import {useQueryClient} from "@tanstack/react-query";





// =====================================================================




interface GroupCardProps {
    group : Group;
}

export default function GroupCard({ group}: GroupCardProps) {

    const router = useRouter();
    const queryClient = useQueryClient();


    const handleClick = () => {
        queryClient.setQueryData(['current_group'] ,group )
        router.push(`/group/${group.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="block rounded-2xl border border-border bg-surface p-5 transition hover:border-border-strong hover:shadow-sm"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
                    <Users size={20} className="text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">
                        {group.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        @{group.slug}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {group.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs text-muted-foreground">
                            {group.view_mode}
                        </span>

                        <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs text-muted-foreground">
                            {group.join_mode}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}