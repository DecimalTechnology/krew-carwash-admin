import { X, Mail, Phone, Shield, Calendar, CheckCircle2, Clock, User } from "lucide-react";
import { IUser } from "../../interface/IUser";

interface UserViewModalProps {
    user: IUser;
    onClose: () => void;
}

export default function UserViewModal({ user, onClose }: UserViewModalProps) {
    if (!user) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 h-24 sm:h-32 flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-brand-500 dark:bg-brand-600 flex items-center justify-center">
                                    <span className="text-3xl sm:text-5xl font-bold text-white uppercase">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            {user.isVerified && (
                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-green-500 rounded-full p-0.5 sm:p-1 border-2 border-white dark:border-gray-800 shadow-lg">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable User Info */}
                <div className="pt-14 sm:pt-20 px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1">
                    {/* Name and Role */}
                    <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {user.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {user.role}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span
                                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.isVerified 
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                }`}
                            >
                                {user.isVerified ? (
                                    <>
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Verified
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending
                                    </>
                                )}
                            </span>
                            <span
                                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.isActive 
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
                                }`}
                            >
                                {user.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 sm:space-y-3">
                        {/* Email */}
                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        {user.phone && (
                            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Phone
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.phone}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Verification Method */}
                        {user.verificationMethod && (
                            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Verification Method
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {user.verificationMethod}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Joined Date */}
                        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Member Since
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
