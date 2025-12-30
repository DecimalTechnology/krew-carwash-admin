import { X, User, Phone, Mail, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface CleanerModalProps {
    cleaner?: any | null;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
}

export default function CleanerAddEditModal({ cleaner, onClose, onSubmit }: CleanerModalProps) {
    const isEdit = Boolean(cleaner);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        isActive: true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isEdit && cleaner) {
            setForm({
                name: cleaner.name || "",
                email: cleaner.email || "",
                phone: cleaner.phone || "",
                password: "",
                isActive: cleaner.isActive ?? true,
            });
        }
    }, [cleaner]);

    // Validation functions
    const validateName = (name: string): string => {
        if (!name.trim()) return "Name is required";
        if (name.trim().length < 2) return "Name must be at least 2 characters";
        if (name.trim().length > 50) return "Name must be less than 50 characters";
        return "";
    };

    const validatePhone = (phone: string): string => {
        if (!phone.trim()) return "Phone number is required";
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) return "Phone number must be at least 10 digits";
        if (digitsOnly.length > 15) return "Phone number is too long";
        // Basic phone validation
        if (!/^\d{10,15}$/.test(digitsOnly)) return "Please enter a valid phone number";
        return "";
    };

    const validateEmail = (email: string): string => {
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return "Please enter a valid email address";
        }
        return "";
    };

    const validatePassword = (password: string): string => {
        if (!isEdit && !password.trim()) return "Password is required";
        if (!isEdit && password.length < 6) return "Password must be at least 6 characters";
        if (!isEdit && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            return "Password must contain both letters and numbers";
        }
        return "";
    };

    // Validate entire form
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        
        const nameError = validateName(form.name);
        if (nameError) newErrors.name = nameError;
        
        const phoneError = validatePhone(form.phone);
        if (phoneError) newErrors.phone = phoneError;
        
        const emailError = validateEmail(form.email);
        if (emailError) newErrors.email = emailError;
        
        if (!isEdit) {
            const passwordError = validatePassword(form.password);
            if (passwordError) newErrors.password = passwordError;
        }
        
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            const fieldErrors = { ...errors };
            delete fieldErrors[name as keyof FormErrors];
            setErrors(fieldErrors);
        }
        
        // If form was submitted, re-validate
        if (isSubmitted) {
            const newErrors = validateForm();
            setErrors(newErrors);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate the specific field
        let error = "";
        switch (name) {
            case "name":
                error = validateName(value);
                break;
            case "phone":
                error = validatePhone(value);
                break;
            case "email":
                error = validateEmail(value);
                break;
            case "password":
                error = validatePassword(value);
                break;
        }
        
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        } else if (errors[name as keyof FormErrors]) {
            const fieldErrors = { ...errors };
            delete fieldErrors[name as keyof FormErrors];
            setErrors(fieldErrors);
        }
    };

    const generateRandomPassword = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        
        let pass = "";
        
        // Ensure at least 2 letters and 2 numbers
        pass += letters[Math.floor(Math.random() * letters.length)];
        pass += letters[Math.floor(Math.random() * letters.length)];
        pass += numbers[Math.floor(Math.random() * numbers.length)];
        pass += numbers[Math.floor(Math.random() * numbers.length)];
        
        // Add remaining 2 random characters from both sets
        const allChars = letters + numbers;
        for (let i = 0; i < 2; i++) {
            pass += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password
        return pass.split('').sort(() => Math.random() - 0.5).join('');
    };

    const handleGeneratePassword = () => {
        const newPass = generateRandomPassword();
        setForm(prev => ({ ...prev, password: newPass }));
        
        // Clear password error if it exists
        if (errors.password) {
            const fieldErrors = { ...errors };
            delete fieldErrors.password;
            setErrors(fieldErrors);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        
        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        Object.keys(form).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);
        
        // Validate form
        const formErrors = validateForm();
        setErrors(formErrors);
        
        // If no errors, submit
        if (Object.keys(formErrors).length === 0) {
            // Prepare data for submission
            const submitData = {
                ...form,
                name: form.name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || "", // Send empty string if email is empty
            };
            onSubmit(submitData);
        }
    };

    // Check if field should show error
    const showError = (fieldName: keyof FormErrors): boolean => {
        return (touched[fieldName] || isSubmitted) && !!errors[fieldName];
    };

    // Check if submit button should be disabled
    const isSubmitDisabled = (): boolean => {
        if (isSubmitted && Object.keys(errors).length > 0) return true;
        
        // For new cleaners, check required fields are filled
        if (!isEdit) {
            if (!form.name.trim() || !form.phone.trim() || !form.password.trim()) {
                return true;
            }
        }
        
        return false;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2 sm:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 h-20 flex items-center justify-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{isEdit ? "Edit Cleaner" : "Add Cleaner"}</h2>
                    <button onClick={onClose} className="absolute top-3 right-3 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Name */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name *
                            </label>
                            {showError("name") && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            showError("name") 
                                ? "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700" 
                                : "bg-gray-50 dark:bg-gray-700/50"
                        }`}>
                            <User className={`w-5 h-5 ${
                                showError("name") 
                                    ? "text-red-500" 
                                    : "text-brand-600 dark:text-brand-400"
                            }`} />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter cleaner name"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone *
                            </label>
                            {showError("phone") && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone}
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            showError("phone") 
                                ? "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700" 
                                : "bg-gray-50 dark:bg-gray-700/50"
                        }`}>
                            <Phone className={`w-5 h-5 ${
                                showError("phone") 
                                    ? "text-red-500" 
                                    : "text-purple-600 dark:text-purple-400"
                            }`} />
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter phone number"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email (optional)
                            </label>
                            {showError("email") && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            showError("email") 
                                ? "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700" 
                                : "bg-gray-50 dark:bg-gray-700/50"
                        }`}>
                            <Mail className={`w-5 h-5 ${
                                showError("email") 
                                    ? "text-red-500" 
                                    : "text-brand-600 dark:text-brand-400"
                            }`} />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter email"
                                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password (only add mode) */}
                    {!isEdit && (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password *
                                </label>
                                {showError("password") && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Generate password"
                                    className={`flex-1 p-2 rounded-lg outline-none transition-all ${
                                        showError("password")
                                            ? "bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-gray-900 dark:text-white"
                                            : "bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                                    }`}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleGeneratePassword} 
                                    className="px-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all whitespace-nowrap"
                                >
                                    Generate
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Password must be at least 6 characters with letters and numbers
                            </p>
                        </div>
                    )}

                    {/* Active Status Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Active Status
                        </label>

                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${form.isActive ? "text-green-600" : "text-red-500"}`}>
                                {form.isActive ? "Active" : "Inactive"}
                            </span>

                            <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                                    ${form.isActive ? "bg-green-500" : "bg-gray-400"}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                                        ${form.isActive ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Form-level error summary */}
                    {isSubmitted && Object.keys(errors).length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Please fix the errors above before submitting
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled()}
                        className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 shadow hover:shadow-lg active:scale-95
                            ${isSubmitDisabled()
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-brand-500 hover:bg-brand-600 text-white"
                            }`}
                    >
                        {isEdit ? "Update Cleaner" : "Add Cleaner"}
                    </button>
                </div>
            </div>
        </div>
    );
}