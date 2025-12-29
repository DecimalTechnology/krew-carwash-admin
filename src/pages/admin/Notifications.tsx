import React, { useEffect, useState } from "react";
import { Bell, Search, Settings, X, Package } from "lucide-react";
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
        await markAllAsReadNotification()
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <Bell className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500">Stay updated with system alerts</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 bg-gray-100 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button onClick={fetchNotifications} disabled={isRefreshing} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors" title="Refresh">
                            <svg className={`w-5 h-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                Mark all read
                            </button>
                        )}

                        <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            <Settings size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <NotificationStories tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <StatsBar notifications={notifications} unreadCount={unreadCount} />

            <div className="px-0">
                <div className="md:hidden px-6 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {unreadCount} unread • {filteredNotifications.length} total
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-b border-gray-200">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => <InstagramNotificationItem key={notification._id} notification={notification} onMarkAsRead={handleMarkAsRead} />)
                    ) : (
                        <div className="text-center py-20 px-6">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <Bell size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No notifications found</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                {searchQuery ? `No notifications match "${searchQuery}". Try different keywords.` : "You're all caught up! New notifications will appear here."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {filteredNotifications.length > 0 && filteredNotifications.length > 5 && (
                    <div className="px-6 py-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Earlier</h2>
                        <div className="text-center py-10 px-6 bg-gray-50 rounded-2xl border border-gray-200">
                            <Package size={32} className="mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-500">No earlier notifications. You're viewing all recent activity.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 py-6 mt-8 border-t border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                        <p>
                            Showing {filteredNotifications.length} of {notifications.length} notifications • Updated just now
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Unread</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Urgent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span>Read</span>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Notification settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
