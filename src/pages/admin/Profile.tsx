import { useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../../app/store";
import EditProfileModal from "../../components/modals/EditProfileModal";
import { Mail, Phone, Calendar, Shield, CheckCircle, User, Edit } from "lucide-react";

export default function Profile() {
    const adminData = useSelector((state: IRootState) => state.admin.adminData);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!adminData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage your account information
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Edit size={20} />
                        Update Profile
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                    {/* Profile Info */}
                    <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                                {adminData.image ? (
                                    <img
                                        src={adminData.image}
                                        alt={adminData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={40} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>
                            {adminData.isActive && (
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                            )}
                        </div>

                        {/* Name and Role */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {adminData.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield size={16} className="text-brand-500" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)} Account
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 rounded-lg">
                                <Mail size={18} className="text-brand-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Email Address
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {adminData.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 rounded-lg">
                                <Phone size={18} className="text-brand-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Phone Number
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">
                                    {adminData.phone || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Status
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                                        {adminData.isActive ? "Active" : "Inactive"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-brand-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Joined
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                                        {formatDate(adminData.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-brand-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Last Updated
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                                        {formatDate(adminData.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 rounded-lg flex-shrink-0">
                            <Shield size={18} className="text-brand-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                Admin Privileges
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                You have full administrative access to the system. This includes managing users, 
                                buildings, cars, packages, and all other system features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {adminData && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    adminData={adminData}
                />
            )}
        </>
    );
}

