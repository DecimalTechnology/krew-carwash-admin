import React, { useState } from "react";
import { Calendar, DollarSign, AlertCircle, MoreHorizontal, CheckCircle, Clock, Bookmark, Send, ChevronRight, X } from "lucide-react";
import { InstagramNotificationItemProps, NotificationTypeInfo } from "../../interface/INotification";
import { markRead } from "../../api/admin/notificationService";
import { useNavigate } from "react-router";

const InstagramNotificationItem: React.FC<any> = ({ notification, onMarkAsRead }) => {
    const [isRead, setIsRead] = useState(notification.isRead);
    const [isSaved, setIsSaved] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate()

    const getNotificationDetails = () => {
        const type = notification.type || "BOOKING";
        const createdAt = new Date(notification.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo = "";
        if (diffMins < 1) {
            timeAgo = "Just now";
        } else if (diffMins < 60) {
            timeAgo = `${diffMins}m ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours}h ago`;
        } else {
            timeAgo = `${diffDays}d ago`;
        }

        const typeMap: Record<string, NotificationTypeInfo> = {
            BOOKING: {
                icon: <Calendar className="text-white" size={16} />,
                iconBg: "from-blue-500 to-cyan-500",
                badgeBg: "bg-blue-100",
                badgeColor: "text-blue-700",
                badgeIcon: <Calendar size={12} />,
                label: "Booking",
            },
            PAYMENT: {
                icon: <DollarSign className="text-white" size={16} />,
                iconBg: "from-green-500 to-emerald-500",
                badgeBg: "bg-green-100",
                badgeColor: "text-green-700",
                badgeIcon: <DollarSign size={12} />,
                label: "Payment",
            },
            ISSUE_REPORT: {
                icon: <AlertCircle className="text-white" size={16} />,
                iconBg: "from-red-500 to-orange-500",
                badgeBg: "bg-red-100",
                badgeColor: "text-red-700",
                badgeIcon: <AlertCircle size={12} />,
                label: "Issue",
            },
        };

        const typeInfo = typeMap[type] || typeMap["BOOKING"];

        return {
            timeAgo,
            typeInfo,

            isUrgent: diffMins < 30,
        };
    };

    const details = getNotificationDetails();

    const handleMarkAsRead = async() => {
        const newStatus = !isRead;
        setIsRead(newStatus);
        if (onMarkAsRead) {
            onMarkAsRead(notification._id, isRead);
        }
       await markRead(notification?._id);


    };


    const navigateFn = ()=>{
         navigate(`/bookings/${notification?.bookingId?._id}`)
    }

    return (
        <div  className={` relative group px-6 py-5 border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-300 ${!isRead ? "bg-gradient-to-r from-blue-50/30 to-transparent" : ""}`}>
            {!isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500"></div>}

            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 relative">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${details.typeInfo.iconBg} flex items-center justify-center text-white shadow-lg`}>{details.typeInfo.icon}</div>
                    {details.isUrgent && !isRead && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <AlertCircle size={8} className="text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-gray-900 text-lg">System Alert</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500 text-sm">{details.timeAgo}</span>
                              
                            </div>

                            <p className="text-gray-800 mb-3 text-base">
                                <span className="font-semibold">{notification.title || "New booking received"}</span>
                                <span className="text-gray-600"> from a customer</span>
                            </p>

                            <div className="flex items-center gap-3">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${details.typeInfo.badgeBg} ${details.typeInfo.badgeColor} text-sm font-medium`}>
                                    {details.typeInfo.badgeIcon}
                                    <span>{details.typeInfo.label}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span onClick={navigateFn} className=" cursor-pointer text-gray-600 text-sm font-medium">ID: {notification?.bookingId?.bookingId}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                onMouseLeave={() => setTimeout(() => setShowOptions(false), 300)}
                            >
                                <MoreHorizontal size={20} className="text-gray-500" />
                            </button>

                            {showOptions && (
                                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                                    <button onClick={handleMarkAsRead} className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors">
                                        {isRead ? (
                                            <>
                                                <Clock size={16} className="text-gray-500" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">Mark as unread</div>
                                                    <div className="text-xs text-gray-500">Show as new notification</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} className="text-green-500" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">Mark as read</div>
                                                    <div className="text-xs text-gray-500">Remove from unread</div>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                    <button onClick={() => setIsSaved(!isSaved)} className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors">
                                        {isSaved ? (
                                            <>
                                                <Bookmark size={16} className="text-yellow-500 fill-current" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">Remove from saved</div>
                                                    <div className="text-xs text-gray-500">Delete from saved items</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Bookmark size={16} className="text-gray-500" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">Save notification</div>
                                                    <div className="text-xs text-gray-500">Add to saved items</div>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                    <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors">
                                        <Send size={16} className="text-blue-500" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">View details</div>
                                            <div className="text-xs text-gray-500">Open booking details</div>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-400" />
                                    </button>
                                    <div className="border-t border-gray-200 my-2"></div>
                                    <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                        <X size={16} />
                                        <div className="font-medium">Delete notification</div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                        <button
                            disabled={isRead}
                            onClick={handleMarkAsRead}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors
    ${isRead ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700 cursor-pointer"}
  `}
                        >
                            <CheckCircle size={16} />
                            {isRead ? "Read" : "Mark as read"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstagramNotificationItem;
