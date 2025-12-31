import React, { useEffect, useState } from "react";
import { Bell, Search, Settings, X, Package, Filter, CheckCircle, AlertCircle, Info, Clock } from "lucide-react";
import { getAllNotifications, getNotificationTypes, markAllAsReadNotification } from "../../api/admin/notificationService";
import { NotificationType } from "../../interface/INotification";
import NotificationStories from "../../components/notification/NotificationStories";
import StatsBar from "../../components/notification/StatusBar";
import InstagramNotificationItem from "../../components/notification/NotificationItem";
import { useSocket } from "../../context/SocketProvider";

const AdminNotificationsPage: React.FC = () => {
    const [tabs, setTabs] = useState<string[]>(["ALL"]);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [activeTab, setActiveTab] = useState("ALL");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const { socket } = useSocket();

    const themeColor = "#4A9D91";

    useEffect(() => {
        const fetchData = async () => {
            const res = await getNotificationTypes();
            setTabs(["ALL", ...(res?.data || [])]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [activeTab]);

    const fetchNotifications = async () => {
        setIsRefreshing(true);
        try {
            const res = await getAllNotifications({
                type: activeTab === "ALL" ? undefined : activeTab,
            });
            setNotifications(res?.data || []);
            const unread = res?.data?.filter((n: NotificationType) => !n.isRead).length || 0;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const markAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        await markAllAsReadNotification();
    };

    const handleMarkAsRead = (id: string, currentStatus: boolean) => {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: !currentStatus } : n)));
        setUnreadCount((prev) => (currentStatus ? prev + 1 : prev - 1));
    };

    const filteredNotifications = notifications.filter(
        (notification) =>
            notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.bookingId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (data: any) => {
            console.log("New notification:", data);
            setNotifications((prev) => [data?.notification, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative z-0">
            {/* Fixed Header with theme color */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: themeColor, backgroundImage: 'linear-gradient(135deg, #4A9D91 0%, #3a7c72 100%)' }}
                        >
                            <Bell className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500">Stay updated with system alerts</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 bg-gray-100 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9D91] focus:border-transparent"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div> */}

                        <button 
                            onClick={fetchNotifications} 
                            disabled={isRefreshing} 
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors" 
                            title="Refresh"
                        >
                            <svg 
                                className={`w-5 h-5 ${isRefreshing ? "text-[#4A9D91] animate-spin" : "text-gray-600"}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2.5 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
                                style={{ 
                                    backgroundColor: themeColor,
                                    backgroundImage: 'linear-gradient(135deg, #4A9D91 0%, #3a7c72 100%)'
                                }}
                            >
                                Mark all read
                            </button>
                        )}

                        {/* <button 
                            onClick={() => setShowSettings(!showSettings)} 
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <Settings size={20} className="text-gray-600" />
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="relative z-0">
                {/* Stories with theme color */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === tab
                                        ? "text-white"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                style={activeTab === tab ? { backgroundColor: themeColor } : {}}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: themeColor }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">
                                    <span className="text-lg font-bold" style={{ color: themeColor }}>{unreadCount}</span> Unread
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                <span className="text-sm text-gray-600">
                                    <span className="font-bold">{notifications.length - unreadCount}</span> Read
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                <span className="text-sm text-gray-600">
                                    <span className="font-bold">{notifications.length}</span> Total
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            Updated just now
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-0 relative z-0">
                    {/* Mobile Search */}
                    <div className="md:hidden px-6 py-4 bg-white border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9D91] focus:border-transparent"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="px-6 py-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                                {unreadCount > 0 && (
                                    <span 
                                        className="px-2 py-1 text-xs font-bold text-white rounded-full"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {unreadCount} NEW
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Filter className="w-4 h-4" />
                                <span>{filteredNotifications.length} notifications</span>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div key={notification._id} className="border-b border-gray-100 last:border-b-0">
                                    <InstagramNotificationItem 
                                        key={notification._id} 
                                        notification={notification} 
                                        onMarkAsRead={handleMarkAsRead}
                                        themeColor={themeColor}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div 
                                    className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: `${themeColor}20`,
                                        border: `2px dashed ${themeColor}80`
                                    }}
                                >
                                    <Bell size={32} style={{ color: themeColor }} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No notifications found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    {searchQuery ? `No notifications match "${searchQuery}". Try different keywords.` : "You're all caught up! New notifications will appear here."}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="px-6 py-3 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                                        style={{ 
                                            backgroundColor: themeColor,
                                            backgroundImage: 'linear-gradient(135deg, #4A9D91 0%, #3a7c72 100%)'
                                        }}
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Earlier Section */}
                    {filteredNotifications.length > 0 && filteredNotifications.length > 5 && (
                        <div className="px-6 py-6 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Earlier Notifications</h2>
                            <div className="text-center py-10 px-6 bg-white rounded-2xl border border-gray-200">
                                <Package size={32} className="mx-auto mb-3" style={{ color: themeColor }} />
                                <p className="text-gray-500">You've reached the end of recent notifications.</p>
                                <p className="text-sm text-gray-400 mt-2">No older notifications to display.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-6 mt-8 border-t border-gray-200 bg-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">
                            <p>
                                Showing <span className="font-medium">{filteredNotifications.length}</span> of{" "}
                                <span className="font-medium">{notifications.length}</span> notifications
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: themeColor }}
                                    ></div>
                                    <span>Unread</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Urgent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <span>Read</span>
                                </div>
                            </div>
                            <button 
                                className="text-sm font-medium hover:underline transition-colors"
                                style={{ color: themeColor }}
                            >
                                Notification settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;