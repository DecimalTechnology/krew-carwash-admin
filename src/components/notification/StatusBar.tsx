import React from "react";
import { Bell, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { StatsBarProps } from "../../interface/INotification";

const StatsBar: React.FC<StatsBarProps> = ({ notifications, unreadCount }) => {
    const stats = [
        {
            label: "Total",
            value: notifications.length,
            icon: <Bell size={16} />,
            color: "from-blue-500 to-cyan-500",
            textColor: "text-blue-600",
        },
        {
            label: "Unread",
            value: unreadCount,
            icon: <AlertCircle size={16} />,
            color: "from-red-500 to-orange-500",
            textColor: "text-red-600",
        },
        {
            label: "Bookings",
            value: notifications.filter((n) => n.type === "BOOKING").length,
            icon: <Calendar size={16} />,
            color: "from-green-500 to-emerald-500",
            textColor: "text-green-600",
        },
        {
            label: "Today",
            value: notifications.filter((n) => {
                const createdAt = new Date(n.createdAt);
                const today = new Date();
                return createdAt.toDateString() === today.toDateString();
            }).length,
            icon: <TrendingUp size={16} />,
            color: "from-purple-500 to-pink-500",
            textColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                            <div className="text-white">{stat.icon}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsBar;
