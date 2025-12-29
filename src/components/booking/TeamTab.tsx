import React from "react";
import { Briefcase, Phone, Mail, User, ExternalLink } from "lucide-react";
import { BookingData } from "../../interface/IBooking";
import CardHeader from "./CardHeader";

interface TeamTabProps {
    booking: BookingData;
}

interface CleanerType {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    status: string;
}

const TeamTab: React.FC<TeamTabProps> = ({ booking }) => {
    const handleCall = (phoneNumber: string) => {
        const formattedPhone = phoneNumber.replace(/\D/g, '');
        window.open(`tel:${formattedPhone}`, '_blank');
    };

    const openGmail = (email: string, name: string) => {
        // Gmail URL format: https://mail.google.com/mail/?view=cm&fs=1&to=email@example.com&su=Subject&body=Body
        const subject = `Regarding Cleaning Service - Booking #${booking.bookingId}`;
        const body = `Hello ${name},\n\nI'm reaching out regarding your cleaning assignment for booking ${booking.bookingId}.`;
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open in new tab
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    };

    const openDefaultEmail = (email: string, name: string) => {
        const subject = `Regarding Cleaning Service - Booking #${booking.bookingId}`;
        const body = `Hello ${name},\n\nI'm reaching out regarding your cleaning assignment for booking ${booking.bookingId}.`;
        
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
    };

    const openManageTeam = () => {
        console.log("Manage team clicked");
        // navigate('/admin/cleaners/manage');
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <CardHeader 
                    title="Assigned Cleaners" 
                    icon={Briefcase} 
                    action={
                        <button 
                            onClick={openManageTeam}
                            className="text-sm font-medium text-[#5DB7AE] hover:text-[#4a9d91] transition-colors"
                        >
                            Manage Team
                        </button>
                    } 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {booking.cleanersAssigned && booking.cleanersAssigned.length > 0 ? (
                        booking.cleanersAssigned.map((cleaner: any) => {
                            const initial = cleaner.name ? cleaner.name.charAt(0).toUpperCase() : '?';
                            
                            return (
                                <div 
                                    key={cleaner._id} 
                                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#5DB7AE]/20 hover:bg-[#5DB7AE]/5 dark:hover:bg-[#5DB7AE]/10 transition-colors group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-[#5DB7AE]/10 text-[#5DB7AE] dark:text-[#5DB7AE] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#5DB7AE]/20">
                                        {initial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                    {cleaner.name || 'Unnamed Cleaner'}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    Professional Cleaner
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 ${
                                                cleaner.status === "Available" 
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                                    : cleaner.status === "Busy"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                            }`}>
                                                {cleaner.status || "Unknown"}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {cleaner.email && (
                                                <div className="flex items-center justify-between gap-2 group/email">
                                                    <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <span 
                                                            className="text-gray-600 dark:text-gray-300 truncate cursor-pointer hover:text-[#5DB7AE] dark:hover:text-[#5DB7AE]"
                                                            onClick={() => openGmail(cleaner.email, cleaner.name)}
                                                            title={`Click to email ${cleaner.email}`}
                                                        >
                                                            {cleaner.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1 shrink-0 opacity-0 group-hover/email:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openGmail(cleaner.email, cleaner.name)}
                                                            className="p-1 text-gray-400 hover:text-[#5DB7AE] transition-colors"
                                                            title="Open in Gmail"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => openDefaultEmail(cleaner.email, cleaner.name)}
                                                            className="p-1 text-gray-400 hover:text-[#5DB7AE] transition-colors"
                                                            title="Open in default email client"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {cleaner.phone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <a 
                                                        href={`tel:${cleaner.phone.replace(/\D/g, '')}`}
                                                        className="text-gray-600 dark:text-gray-300 hover:text-[#5DB7AE] dark:hover:text-[#5DB7AE]"
                                                    >
                                                        {cleaner.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {cleaner.phone ? (
                                                <button 
                                                    onClick={() => handleCall(cleaner.phone)}
                                                    className="flex-1 py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <Phone className="w-4 h-4" /> Call
                                                </button>
                                            ) : (
                                                <button 
                                                    disabled
                                                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed"
                                                >
                                                    <Phone className="w-4 h-4" /> No Phone
                                                </button>
                                            )}
                                            
                                            {cleaner.email ? (
                                                <div className="relative flex-1 group">
                                                    <button 
                                                        onClick={() => openGmail(cleaner.email, cleaner.name)}
                                                        className="w-full py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <Mail className="w-4 h-4" /> Email
                                                    </button>
                                                    
                                                    {/* Dropdown for email options */}
                                                    <div className="absolute bottom-full left-0 mb-1 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                                                            <button
                                                                onClick={() => openGmail(cleaner.email, cleaner.name)}
                                                                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                                                </svg>
                                                                Open in Gmail
                                                            </button>
                                                            <button
                                                                onClick={() => openDefaultEmail(cleaner.email, cleaner.name)}
                                                                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                                Open in Default Client
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    disabled
                                                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed"
                                                >
                                                    <Mail className="w-4 h-4" /> No Email
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Cleaners Assigned
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                This booking doesn't have any cleaners assigned yet. Assign cleaners to manage the service sessions.
                            </p>
                            <button 
                                onClick={openManageTeam}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5DB7AE] hover:bg-[#4a9d91] text-white font-medium rounded-lg transition-colors"
                            >
                                <Briefcase className="w-5 h-5" />
                                Assign Cleaners
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                {booking.cleanersAssigned && booking.cleanersAssigned.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Team Statistics</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {booking.cleanersAssigned.length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Cleaners</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {booking.cleanersAssigned.filter((c: any) => c.status === "Available").length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Available Now</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {booking.package?.totalSessions || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamTab;