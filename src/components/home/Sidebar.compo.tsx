
import {useSidebarStore} from "@/stores/side_bar/side_bar.store";
import {useThemeStore} from "@/stores/theme/theme.store";
import {
    ChevronLeft,
    ChevronRight, Form,
    Handshake,
    Home, Languages,
    LogOut,
    Moon,
    Sun, Telescope,
    UserGroup,
    UserRound,
    Users,
    X
} from "lucide-react";

import { useOpenLanguageSelector} from "@/components/_share/language_model/LanguageSelectorBtn.compo";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";
import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/navigation";



export default function Sidebar() {

    const { isOpen, toggleSidebar } = useSidebarStore();
    const { theme , toggleTheme } = useThemeStore();
    const openLanguageSelectorFn = useOpenLanguageSelector();
    const router = useRouter();

    const txt =  useTranslations('Sidebar');


    return (
        <aside
            className={` absolute inset-y-0 left-0 z-40 rounded-2xl  flex flex-col border-r border-border bg-surface transition-all duration-300 /* Mobile */ w-64 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } /* Desktop */ md:relative md:translate-x-0 ${
                isOpen ? "md:w-64" : "md:w-16"
            } `}
        >

            {/* Header */}
            <div
                className={` flex h-16 items-center border-b border-border ${
                    isOpen ? "justify-between px-4" : "justify-center"
                } `}
            >
                {isOpen ? 'NONJ' : null}

                {/* Mobile close */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                    className=" flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-hover  "
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} /> }
                </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                <SidebarButton
                    icon={<Home size={19} />}
                    label={txt('home')}
                    isOpen={isOpen}
                    onClick={()=>router.push('/')}
                />
                {/*txt('group')*/}
                <SidebarButton
                    icon={< Handshake size={19} />}
                    label={txt('group')}
                    isOpen={isOpen}
                    onClick={()=>router.push('/group')}
                />
                <SidebarButton
                    icon={< Telescope size={19} />}
                    label={ txt('group_search') }
                    isOpen={isOpen}
                    onClick={()=>router.push('/group_search')}
                />


                <SidebarButton
                    icon={< UserGroup size={19} />}
                    label={txt('friend')}
                    isOpen={isOpen}
                    onClick={()=>router.push('/friends')}

                />
                <SidebarButton
                    icon={< Form size={19} />}
                    label={txt('exam_preparation')}
                    isOpen={isOpen}
                    onClick={()=>router.push('/exam_preparation')}

                />
            </nav>

            {/* Bottom actions */}
            <div className="space-y-1 border-t border-border p-3">
                {/*test language*/}
                <SidebarButton
                    icon={<Languages  size={19} />}
                    label={txt('language')}
                    onClick={openLanguageSelectorFn}
                    isOpen={isOpen}
                />

                <SidebarButton
                    icon={theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                    label={theme === 'dark' ? txt('theme_light') : txt('theme_dark') }
                    onClick={toggleTheme}
                    isOpen={isOpen}
                />
                <SidebarButton
                    icon={<LogOut size={19} />}
                    label={txt('logout')}
                    isOpen={isOpen}
                />
            </div>
        </aside>
    );
}
function SidebarButton({icon, label, onClick, isOpen}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isOpen: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={!isOpen ? label : undefined}
            className={` flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-surface-hover hover:text-foreground ${
                isOpen ? "gap-3 px-3" : "justify-center px-0"
            } `}
        >
            {icon}
            <span className={` whitespace-nowrap ${!isOpen ? "hidden" : ""} `}>
                {label}
            </span>
        </button>
    );
}
