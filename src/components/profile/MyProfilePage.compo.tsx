'use client';

import {
    Mail,
    User,
} from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';

import { Card } from '@/components/ui/card';

import { myProfile } from '@/mock/group';

export default function MyProfilePage() {
    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Profile
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Your personal information.
                </p>
            </div>

            {/* Profile header */}
            <Card className="mt-6 overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                        <Avatar className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                            <AvatarImage
                                src={myProfile.avatar_url}
                                alt={myProfile.user_name}
                            />

                            <AvatarFallback className="text-2xl">
                                {myProfile.nickname
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 text-center sm:text-left">
                            <h2 className="text-xl font-semibold text-foreground">
                                {myProfile.nickname}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                @{myProfile.user_name}
                            </p>

                            <p className="mt-2 break-all text-sm text-muted-foreground">
                                {myProfile.email}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Information */}
            <Card className="mt-4 p-5 sm:p-6">
                <h2 className="text-lg font-semibold">
                    Information
                </h2>

                <div className="mt-5 space-y-5">
                    {/* Username */}
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
                            <User size={17} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Username
                            </p>

                            <p className="mt-1 text-sm font-medium">
                                @{myProfile.user_name}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
                            <Mail size={17} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm font-medium">
                                {myProfile.email}
                            </p>
                        </div>
                    </div>

                    {/* Nickname */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Nickname
                        </p>

                        <p className="mt-1 text-sm font-medium">
                            {myProfile.nickname}
                        </p>
                    </div>

                    {/* Bio */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Bio
                        </p>

                        <div className="mt-2 rounded-xl bg-surface-hover p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                                {myProfile.bio ||
                                    'No bio yet.'}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}