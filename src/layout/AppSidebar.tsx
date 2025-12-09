import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useSocket } from "../context/SocketProvider";

import {
    AlertCircle,
    Bell,
    Building2,
    CalendarCheck,
    Car,
    Package,
    Sparkles,
    Tag,
    LayoutDashboard,
} from "lucide-react";

import { UserIcon } from "../icons";
import { getUnresolvedReportCount } from "../api/admin/chatService";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path: string;
};

const navItems: NavItem[] = [
    { icon: <LayoutDashboard />, name: "Dashboard", path: "/" },
    { icon: <UserIcon />, name: "Users", path: "/users" },
    { icon: <Building2 />, name: "Buildings", path: "/building" },
    { icon: <Sparkles />, name: "Cleaners", path: "/cleaners" },
    { icon: <CalendarCheck />, name: "Bookings", path: "/bookings" },
    { icon: <Car />, name: "Car Types", path: "/cars" },
    { icon: <Package />, name: "Packages", path: "/packages" },
    { icon: <Tag />, name: "Pricing", path: "/vehicles" },
    { icon: <AlertCircle />, name: "Issue Reports", path: "/issue-reports" },
    { icon: <Bell />, name: "Notifications", path: "/notifications" },
];

const AppSidebar: React.FC = () => {
    const { socket } = useSocket();
    const [count, setCount] = useState(0);

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {


        const fetchData = async()=>{
           const res= await getUnresolvedReportCount();
           setCount(res?.data)
        }

        fetchData()
        if (!socket) return;

        socket.on("notify_issue", (count: number) => setCount(count));

        return () => {
            socket.off("notify_issue");
        };
    }, [socket]);

    const renderMenuItems = (items: NavItem[]) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav) => {
                const isIssueMenu = nav.name === "Issue Reports";
                const showNumberBadge =
                    isIssueMenu && count > 0 && (isExpanded || isHovered || isMobileOpen);

                const showDotBadge =
                    isIssueMenu && count > 0 && !(isExpanded || isHovered || isMobileOpen);

                return (
                    <li key={nav.name} className="relative">
                        <Link
                            to={nav.path}
                            className={`menu-item group ${
                                isActive(nav.path)
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                            }`}
                        >
                            <span
                                className={`relative menu-item-icon-size ${
                                    isActive(nav.path)
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                }`}
                            >
                                {nav.icon}

                                {/* small red dot when sidebar collapsed */}
                                {showDotBadge && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                                )}
                            </span>

                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text flex items-center w-full">
                                    {nav.name}

                                    {/* count badge */}
                                    {showNumberBadge && (
                                        <span className="ml-auto text-[10px] bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full">
                                            {count}
                                        </span>
                                    )}
                                </span>
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
            ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6 mt-10">
                    <div className="flex flex-col gap-6">
                        {renderMenuItems(navItems)}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
