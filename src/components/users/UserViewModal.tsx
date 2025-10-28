import { X } from "lucide-react"; // Lucide React Icon
import { IUser } from "../../interface/IUser"; // Adjust path to your interface

interface UserViewModalProps {
    user: IUser;
    onClose: () => void;
}

export default function UserViewModal({ user, onClose }: UserViewModalProps) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md p-6 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="space-y-4 text-center mt-4">
                    <img
                        src={user.image || "/no-profile.jpg"}
                        alt={user.name}
                        className="w-20 h-20 rounded-full mx-auto border dark:border-gray-700"
                    />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-gray-400 dark:text-gray-500">{user.role}</p>

                    {/* Other Details */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        {user.phone && <p><strong className="dark:text-gray-300">Phone:</strong> {user.phone}</p>}
                        {user.verificationMethod && (
                            <p><strong className="dark:text-gray-300">Verification Method:</strong> {user.verificationMethod}</p>
                        )}
                        <p><strong className="dark:text-gray-300">Active:</strong> {user.isActive ? "Yes" : "No"}</p>
                        <p><strong className="dark:text-gray-300">Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p>
                            <strong className="dark:text-gray-300">Status:</strong>{" "}
                            <span
                                className={`ml-2 px-2 py-1 rounded ${
                                    user.isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-black dark:text-gray-900"
                                }`}
                            >
                                {user.isVerified ? "Verified" : "Pending"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] hover:from-[#3a7d74] hover:to-[#5DB7AE] text-white px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
