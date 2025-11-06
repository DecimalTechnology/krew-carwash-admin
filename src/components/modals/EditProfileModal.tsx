import { useState, FormEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateAdminData } from "../../features/adminSlice";
import { updateAdminProfile } from "../../api/admin/profileService";
import { AdminData } from "../../features/adminSlice";
import { X, Upload, User } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    adminData: AdminData;
}

export default function EditProfileModal({ isOpen, onClose, adminData }: EditProfileModalProps) {
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [name, setName] = useState(adminData?.name || "");
    const [email, setEmail] = useState(adminData?.email || "");
    const [phone, setPhone] = useState(adminData?.phone?.toString() || "");
    const [imagePreview, setImagePreview] = useState(adminData?.image || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            if (phone) {
                formData.append("phone", phone);
            }
            
            // Append image file if selected
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await updateAdminProfile(formData);
            
            if (response.success && response.data) {
                dispatch(updateAdminData(response.data));
                onClose();
            }
        } catch (error) {
            console.error("Profile update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200"
            onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 px-6 py-5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <User size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Edit Profile
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 shadow-lg">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={48} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-all duration-200 shadow-lg"
                            >
                                <Upload size={18} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            Click the icon to upload a new profile picture
                        </p>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your phone number"
                        />
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

