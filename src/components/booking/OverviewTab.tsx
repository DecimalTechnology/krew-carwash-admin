import React from "react";
import { Calendar, Clock, ShieldCheck, FileText, LayoutDashboard, MapPin } from "lucide-react";
import { BookingData } from "../../interface/IBooking";
import { formatDate } from "./FormDate";
import DetailRow from "./DetailRow";


interface OverviewTabProps {
    booking: BookingData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ booking }) => {
    const completedSessions = booking.package?.sessions.filter((s) => s.isCompleted).length || 0;
    const totalSessions = booking.package?.totalSessions || 0;
    const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-[#5DB7AE]/10 text-[#5DB7AE] rounded-xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Start Date</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(booking.startDate)}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Frequency</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{booking.package?.packageId?.frequency || "N/A"}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Booking Status</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{booking.status?.toLowerCase()}</p>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Progress</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Tracking your {booking.package?.packageId?.name}</p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <span className="text-4xl font-bold text-[#5DB7AE]">{Math.round(progress)}%</span>
                        <span className="text-gray-400 ml-2">Completed</span>
                    </div>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5DB7AE] rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span>0 Sessions</span>
                    <span>{totalSessions} Sessions</span>
                </div>
            </div>

            {/* Basic Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Booking Info</h3>
                    <div className="space-y-0">
                        <DetailRow icon={FileText} label="Booking ID" value={booking.bookingId} />
                        <DetailRow icon={LayoutDashboard} label="Booking Type" value={booking.bookingType} />
                        <DetailRow icon={Calendar} label="End Date" value={formatDate(booking.endDate)} isLast />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Location Info</h3>
                    <div className="space-y-0">
                        <DetailRow icon={MapPin} label="Building" value={booking.buildingId?.buildingName} />
                        <DetailRow icon={MapPin} label="Area" value={booking.buildingId ? `${booking.buildingId.area}, ${booking.buildingId.city}` : ""} />
                        <DetailRow icon={MapPin} label="Address" value={booking.buildingId?.address} isLast />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;