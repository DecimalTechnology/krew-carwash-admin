import React, { useState, useEffect } from "react";
import { Calendar, Camera, CheckCircle, Circle, X, User, Phone, Mail, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Session } from "../../interface/IBooking";
import { getSessionDetails } from "../../api/admin/bookingServie";

interface SessionCardProps {
    session: Session;
    index: number;
    total: number;
    type: "PACKAGE" | "ADDON";
    onClick: any;
    bookingId: string;
    addonId: any;
}

// New SessionDetailsModal Component
interface SessionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionData: any;
    sessionNumber: number;
    totalSessions: number;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ isOpen, onClose, sessionData, sessionNumber, totalSessions }) => {
    if (!isOpen || !sessionData) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 px-6 py-5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Session Details</h2>
                            <p className="text-sm text-white/80">Session {sessionNumber} of {totalSessions}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Status Section */}
                        <div className={`p-4 rounded-lg ${
                            sessionData.isCompleted 
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800" 
                                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${
                                        sessionData.isCompleted 
                                            ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400" 
                                            : "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                                    }`}>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {sessionData.isCompleted ? "Completed Session" : "Scheduled Session"}
                                        </h3>
                                        <p className={`text-sm ${sessionData.isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                                            {sessionData.isCompleted ? "This session has been completed" : "This session is scheduled"}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    sessionData.isCompleted 
                                        ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300" 
                                        : "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                                }`}>
                                    {sessionData.isCompleted ? "Completed" : "Scheduled"}
                                </span>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                                    <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Session Date & Time</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {formatDate(sessionData.date)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cleaners Section */}
                        {sessionData.completedBy && sessionData.completedBy.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                    Assigned Cleaners ({sessionData.completedBy.length})
                                </h4>
                                <div className="space-y-3">
                                    {sessionData.completedBy.map((cleaner: any, idx: number) => (
                                        <div key={cleaner._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                                <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900 dark:text-white">{cleaner.name}</h5>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                        <Phone className="w-3 h-3" />
                                                        {cleaner.phone}
                                                    </div>
                                                    {cleaner.email && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                            <Mail className="w-3 h-3" />
                                                            {cleaner.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs px-2 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded">
                                                {cleaner.role}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Images Section */}
                        {sessionData.images && sessionData.images.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                    Session Photos ({sessionData.images.length})
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {sessionData.images.map((image: string, idx: number) => (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img 
                                                src={image} 
                                                alt={`Session photo ${idx + 1}`} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(!sessionData.images || sessionData.images.length === 0) && (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">No photos uploaded for this session</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const SessionCard: React.FC<SessionCardProps> = ({ session, index, total, onClick, bookingId, type, addonId }) => {
    const isCompleted = session.isCompleted;
    const [sessionData, setSessionData] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSelect = async () => {
        setLoading(true);
        try {
            const res = await getSessionDetails(
                bookingId, 
                session?._id, 
                type === "PACKAGE" ? "package" : "addon", 
                type === "ADDON" ? addonId : ""
            );
            setSessionData(res?.data);
            setModalOpen(true);
        } catch (error) {
            console.error("Error fetching session details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className={`
                    relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 group cursor-pointer
                    ${
                        isCompleted
                            ? "bg-white dark:bg-gray-800 border-emerald-100 dark:border-gray-700 shadow-sm hover:border-emerald-200"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#5DB7AE] hover:shadow-md"
                    }
                `}
                onClick={handleSelect}
            >
                <div className="flex justify-between items-start mb-3">
                    <span
                        className={`
                            text-xs font-bold px-2.5 py-1 rounded-md border
                            ${
                                isCompleted
                                    ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/30"
                                    : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"
                            }
                        `}
                    >
                        Session {index + 1}
                    </span>
                    {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-transparent" />
                    ) : (
                        <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )}
                </div>

                <div className="flex items-start gap-3">
                    <div
                        className={`p-2 rounded-lg ${
                            isCompleted ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {isCompleted ? new Date(session?.date).toLocaleString() : "Scheduled Session"}
                        </div>
                        <div className={`text-xs mt-1 ${isCompleted ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                            {isCompleted ? "Completed" : "Upcoming"}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Camera className="w-3.5 h-3.5" />
                        Photos
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect();
                        }}
                        className="flex-1 text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "View Details"}
                    </button>
                </div>
            </div>

            {/* Session Details Modal */}
            <SessionDetailsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                sessionData={sessionData}
                sessionNumber={index + 1}
                totalSessions={total}
            />
        </>
    );
};

export default SessionCard;