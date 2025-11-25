import { X, User, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

interface CleanerModalProps {
    cleaner?: any | null;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function CleanerAddEditModal({ cleaner, onClose, onSubmit }: CleanerModalProps) {
    const isEdit = Boolean(cleaner);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        status: "Available",
        isActive: true,
    });

    useEffect(() => {
        if (isEdit && cleaner) {
            setForm({
                name: cleaner.name || "",
                email: cleaner.email || "",
                phone: cleaner.phone || "",
                password: "",
                status: cleaner.status || "Available",
                isActive: cleaner.isActive ?? true,
            });
        }
    }, [cleaner]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let pass = "";
        for (let i = 0; i < 6; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)];
        }
        return pass;
    };

    const handleGeneratePassword = () => {
        const newPass = generateRandomPassword();
        setForm((prev) => ({ ...prev, password: newPass }));
    };

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2 sm:p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 h-20 flex items-center justify-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {isEdit ? "Edit Cleaner" : "Add Cleaner"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            <User className="text-brand-600 dark:text-brand-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter cleaner name"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                        </label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            <Phone className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email (optional)
                        </label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                            <Mail className="text-brand-600 dark:text-brand-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Password (only add mode) */}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Generate password"
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg outline-none text-gray-900 dark:text-white"
                                />

                                <button
                                    type="button"
                                    onClick={handleGeneratePassword}
                                    className="px-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg outline-none text-gray-900 dark:text-white"
                        >
                            <option value="Available">Available</option>
                            <option value="On Task">On Task</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow hover:shadow-lg active:scale-95"
                    >
                        {isEdit ? "Update Cleaner" : "Add Cleaner"}
                    </button>
                </div>
            </div>
        </div>
    );
}
