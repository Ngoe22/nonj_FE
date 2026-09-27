'use client';

import { ReactNode, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from "@/components/home/Sidebar.compo";
import {useSidebarStore} from "@/stores/side_bar/side_bar.store";
import {useThemeStore} from "@/stores/theme/theme.store";
import {useGetMyProfile} from "@/hooks/profile/useGetMyProfile.hook";
import {Link} from "@/i18n/navigation";

interface HomeLayoutProps {
    children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {

    const { isOpen, toggleSidebar } = useSidebarStore();
    const initTheme = useThemeStore((state) => state.initTheme);

    const { data: user, isLoading } = useGetMyProfile();

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return (
        <div className="min-h-screen  p-2  sm:p-4 md:p-5 bg-background ">
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
                            <p
                                className={'text-muted-foreground'}
                            >@{user?.user_name}</p>
                            {/* Avatar */}
                            <Link
                                href="/profile"
                                className="block h-8 w-8 overflow-hidden rounded-full"
                            >
                                <img
                                    src="https://i.pinimg.com/736x/01/ac/5b/01ac5b864a6c29efb24c1145aeb9c7be.jpg"
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
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
