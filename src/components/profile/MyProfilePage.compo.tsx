'use client';



import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {useGetMyProfile} from "@/hooks/profile/useGetMyProfile.hook";
import {ProfileSkeleton} from "@/components/profile/ProfileSkeletons.compo";
import {ProfileError} from "@/components/profile/ProfileError.compo";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import {MyProfileHeader} from "@/components/profile/MyProfileHeader.compo";
import {MyProfileInfo} from "@/components/profile/MyProfileInfo.compo";
import {useLogout} from "@/hooks/auth/useLogout.hook";
import ProfileSecurityBlock from "@/components/profile/ProfileSecurityBlock.compo";

// import { myProfile } from '@/mock/group';

export default function MyProfilePage() {

    const txt = useTranslations('MyProfile')
   const { data:myProfile , isPending ,error } = useGetMyProfile()
    const logout = useLogout()

    if (isPending) return <ProfileSkeleton />;
    if (error) return <ProfileError message={error.message} />;
    if (!myProfile) return null;

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
                user_name={myProfile.user_name ?? ''}
                avatar_url={myProfile.avatar_url}
            />


            {/* Information */}
            <MyProfileInfo
                editAble={{
                    nickname: myProfile.nickname,
                    // API trả `bio: string | null` → form chỉ nhận string
                    bio: myProfile.bio ?? '',
                }}
                uneditAble={{
                    user_name: myProfile.user_name ?? '',
                    email: myProfile.email,
                }}
            />


            {/* Mật khẩu & bảo mật: đổi mật khẩu · reset qua email · đăng xuất mọi thiết bị */}
            <Card className="mt-4 p-5 sm:p-6">
                <ProfileSecurityBlock />
            </Card>

            {/*logout*/}
            <Card className="mt-4 p-5 sm:p-6">
                <Button
                    onClick={() => logout.mutate('one')}
                    disabled={logout.isPending}
                    className={`gap-2 text-card hover:bg-destructive hover:text-white bg-card-foreground`}
                >
                    {logout.isPending && (
                        <Loader2 size={15} className="animate-spin" />
                    )}
                    {txt('logout_btn')}
                </Button>
            </Card>

        </div>
    );
}