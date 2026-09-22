'use client';



import { Card } from '@/components/ui/card';
import {useGetMyProfile} from "@/hooks/profile/useGetMyProfile.hook";
import {ProfileSkeleton} from "@/components/profile/ProfileSkeletons.compo";
import {ProfileError} from "@/components/profile/ProfileError.compo";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {MyProfileHeader} from "@/components/profile/MyProfileHeader.compo";
import {MyProfileInfo} from "@/components/profile/MyProfileInfo.compo";

// import { myProfile } from '@/mock/group';

export default function MyProfilePage() {

    const txt = useTranslations('MyProfile')
   const { data:myProfile , isPending ,error } = useGetMyProfile()

    if (isPending) return <ProfileSkeleton />;
    if (error) return <ProfileError message={error.message} />;
    if (!myProfile) return null; // fallback an toàn

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    {txt('my_profile_header')}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    {txt('my_profile_desc')}
                </p>
            </div>

            {/* Profile header */}
            <MyProfileHeader
                email={myProfile.email}
                nickname={myProfile.nickname}
                user_name={myProfile.user_name}
                avatar_url={myProfile.avatar_url}
            />


            {/* Information */}
            <MyProfileInfo
                editAble={{
                    nickname: myProfile.nickname,
                    bio: myProfile.bio,
                }}
                uneditAble={{
                    user_name: myProfile.user_name,
                    email: myProfile.email,
                }}
            />


            {/*<Card className="mt-4 p-5 sm:p-6">*/}
            {/*    <h2 className="text-lg font-semibold">*/}
            {/*        {txt('info_header')}*/}
            {/*    </h2>*/}

            {/*    <div className="mt-5 space-y-5">*/}
            {/*        /!* Username *!/*/}
            {/*        <div className="flex gap-3">*/}
            {/*            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">*/}
            {/*                <User size={17} />*/}
            {/*            </div>*/}

            {/*            <div className="min-w-0">*/}
            {/*                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">*/}
            {/*                    {txt('user_name')}*/}

            {/*                </p>*/}

            {/*                <p className="mt-1 text-sm font-medium">*/}
            {/*                    @{myProfile.user_name}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Email *!/*/}
            {/*        <div className="flex gap-3">*/}
            {/*            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">*/}
            {/*                <Mail size={17} />*/}
            {/*            </div>*/}

            {/*            <div className="min-w-0">*/}
            {/*                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">*/}
            {/*                    {txt('email')}*/}
            {/*                </p>*/}

            {/*                <p className="mt-1 break-all text-sm font-medium">*/}
            {/*                    {myProfile.email}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Nickname *!/*/}
            {/*        <div>*/}
            {/*            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">*/}
            {/*                {txt('nickname')}*/}
            {/*            </p>*/}

            {/*            <p className="mt-1 text-sm font-medium">*/}
            {/*                {myProfile.nickname}*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        /!* Bio *!/*/}
            {/*        <div>*/}
            {/*            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">*/}
            {/*                {txt('bio')}*/}

            {/*            </p>*/}

            {/*            <div className="mt-2 rounded-xl bg-surface-hover p-4">*/}
            {/*                <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">*/}
            {/*                    {myProfile.bio ||*/}
            {/*                        ' '}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Card>*/}


            {/*logout*/}
            <Card className="mt-4 p-5 sm:p-6">
                <Button
                    className={`text-card  hover:text-white  bg-card-foreground  hover:bg-destructive`}
                >
                    {txt('logout_btn')}
                </Button>
            </Card>

        </div>
    );
}