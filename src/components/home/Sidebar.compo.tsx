import {useSidebarStore} from "@/stores/side_bar/side_bar.store";
import {useThemeStore} from "@/stores/theme/theme.store";
import {
    ChevronLeft,
    ChevronRight,
    Handshake,
    Home,
    LogOut,
    Moon,
    Sun,
    UserGroup,
    UserRound,
    Users,
    X
} from "lucide-react";
import {useRouter} from "next/navigation";


export default function Sidebar() {
    const { isOpen, toggleSidebar } = useSidebarStore();
    const { darkMode, toggleTheme } = useThemeStore();
    const router = useRouter();


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
                    className=" flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover  "
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} /> }
                </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                <SidebarButton
                    icon={<Home size={19} />}
                    label="Home"
                    isOpen={isOpen}
                    onClick={()=>router.push('/')}
                />
                <SidebarButton
                    icon={< Handshake size={19} />}
                    label="Group"
                    isOpen={isOpen}
                    onClick={()=>router.push('/group')}
                />
                <SidebarButton
                    icon={< UserGroup size={19} />}
                    label="Friend"
                    isOpen={isOpen}
                    onClick={()=>router.push('/friend')}

                />
            </nav>
            {/* Bottom actions */}
            <div className="space-y-1 border-t border-border p-3">
                <SidebarButton
                    icon={darkMode ? <Sun size={19} /> : <Moon size={19} />}
                    label={darkMode ? "Light theme" : "Dark theme"}
                    onClick={toggleTheme}
                    isOpen={isOpen}
                />
                <SidebarButton
                    icon={<LogOut size={19} />}
                    label="Logout"
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
            className={` flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-foreground ${
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
