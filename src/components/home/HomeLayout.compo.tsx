'use client';

import { ReactNode, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from "@/components/home/Sidebar.compo";
import {useSidebarStore} from "@/stores/side_bar/side_bar.store";
import {useThemeStore} from "@/stores/theme/theme.store";
import {useGetMyProfile} from "@/hooks/profile/useGetMyProfile.hook";
import {Link, useRouter} from "@/i18n/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import NotificationBell from "@/components/notification/NotificationBell.compo";
import NotificationSocketProvider from "@/components/notification/NotificationSocketProvider.compo";

interface HomeLayoutProps {
    children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {

    const { isOpen, toggleSidebar } = useSidebarStore();
    const initTheme = useThemeStore((state) => state.initTheme);

    const { data: user, isLoading } = useGetMyProfile();
    const router = useRouter();

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    // Tài khoản Google mới CHƯA chọn username (BE để user_name = null) -> chặn
    // dùng app, đưa thẳng về màn chọn username cho tới khi đặt xong.
    useEffect(() => {
        if (!isLoading && user && !user.user_name) {
            router.replace('/username');
        }
    }, [isLoading, user, router]);

    return (
        <div className="min-h-screen  p-2  sm:p-4 md:p-5 bg-background ">
            {/* Mở WebSocket 1 lần cho cả app */}
            <NotificationSocketProvider />

            <div
                className="relative flex gap-4 h-[calc(100vh-1.5rem)] overflow-hidden sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]"
            >

                {/* Sidebar */}
                <Sidebar />

                {/* Mobile overlay */}
                {isOpen && (
                    <button
                        aria-label="Close sidebar"
                        onClick={toggleSidebar}
                        className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    />
                )}

                {/* Content */}
                <main className="relative min-w-0 flex-1 overflow-y-auto flex flex-col gap-3 ">

                    {/* Header */}
                    <header className="flex shrink-0 items-center justify-between bg-surface  md:justify-end p-4 rounded-2xl">

                        {/* Toggle sidebar */}
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                            className="  flex h-10 w-10  items-center justify-center  rounded-xl border border-border
                                         bg-surface  text-foreground  shadow-sm transition hover:bg-surface-hover md:hidden "
                        >
                            <Menu size={19} />
                        </button>

                        <div className={`flex items-center gap-4`} >
                            {/* Chuông thông báo + dropdown */}
                            <NotificationBell />

                            <p
                                className={'text-muted-foreground'}
                            >@{user?.user_name}</p>

                            {/* Avatar */}
                            <Link
                                href="/profile"
                                className="block h-8 w-8 shrink-0 overflow-hidden rounded-full"
                            >
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.user_name ?? ''} />
                                    <AvatarFallback>
                                        {user?.nickname?.charAt(0).toUpperCase() ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    </header>

                    {/* Body */}
                    <div className="min-h-0
                        flex-1
                        overflow-y-auto
                        scrollbar-none
                        rounded-2xl
                        bg-surface
                        p-4">
                        {children}
                    </div>

                </main>
            </div>
        </div>
    );
}
