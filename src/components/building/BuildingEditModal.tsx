/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { IBuilding } from "../../interface/IBuilding";
import { Building2, X, Plus, Phone } from "lucide-react";
import Switch from "../ui/switch/Switch";
import toast from "react-hot-toast";
import { updateBuilding } from "../../api/admin/buildingService";
import PackageSelector from "./PackageSelector";

interface IProps {
    isOpen: boolean;
    building: IBuilding | null;
    onClose: () => void;
    onUpdate: (updatedBuilding: IBuilding) => void;
}

interface ValidationErrors {
    buildingName?: string;
    address?: string;
    city?: string;
    area?: string;
    contactNumbers?: string[];
}

function BuildingEditModal({ isOpen, building, onClose, onUpdate }: IProps) {
    const [formData, setFormData] = useState<any>({
        buildingName: "",
        address: "",
        city: "",
        area: "",
        isActive: true,
        packages:[]
    });

    const [contactNumbers, setContactNumbers] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (building) {
            setFormData({
                buildingName: building.buildingName,
                address: building.address || "",
                city: building.city,
                area: building.area,
                isActive: building.isActive,
                packages:building.packages
            });

            if (building.contactNumbers && building.contactNumbers.length > 0) {
                setContactNumbers(building.contactNumbers);
            } else {
                setContactNumbers([""]);
            }

            // Clear errors when building data loads
            setErrors({});
        }
    }, [building]);

    if (!isOpen || !building) return null;

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        // Building Name validation
        if (!formData.buildingName.trim()) {
            newErrors.buildingName = "Building name is required";
            isValid = false;
        } else if (formData.buildingName.trim().length < 2) {
            newErrors.buildingName = "Building name must be at least 2 characters";
            isValid = false;
        } else if (formData.buildingName.trim().length > 100) {
            newErrors.buildingName = "Building name cannot exceed 100 characters";
            isValid = false;
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = "City is required";
            isValid = false;
        } else if (formData.city.trim().length < 2) {
            newErrors.city = "City must be at least 2 characters";
            isValid = false;
        } else if (!/^[a-zA-Z\s\-']+$/.test(formData.city.trim())) {
            newErrors.city = "City can only contain letters, spaces, hyphens, and apostrophes";
            isValid = false;
        }

        // Area validation
        if (!formData.area.trim()) {
            newErrors.area = "Area is required";
            isValid = false;
        } else if (formData.area.trim().length < 2) {
            newErrors.area = "Area must be at least 2 characters";
            isValid = false;
        }

        // Address validation (optional)
        if (formData.address.trim() && formData.address.trim().length < 5) {
            newErrors.address = "Address must be at least 5 characters if provided";
            isValid = false;
        }

        // Contact Numbers validation
        const contactErrors: string[] = [];
        const validContacts = contactNumbers.filter((num) => num.trim() !== "");

        if (validContacts.length === 0) {
            // Check if there's at least one non-empty contact
            if (contactNumbers.some((num) => num.trim() !== "")) {
                // If there are contacts but all are empty after trim
                contactErrors.push("Contact number cannot be empty spaces");
            } else {
                contactErrors.push("At least one contact number is required");
            }
            isValid = false;
        } else {
            validContacts.forEach((num, index) => {
                // Find the original index in contactNumbers array
                const originalIndex = contactNumbers.findIndex((cn) => cn === num);

                // Phone number validation (adjust regex for your country)
                const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
                const cleanedNum = num.trim();

                if (!phoneRegex.test(cleanedNum)) {
                    contactErrors[originalIndex] = "Invalid phone number format";
                    isValid = false;
                } else if (cleanedNum.replace(/\D/g, "").length < 10) {
                    contactErrors[originalIndex] = "Phone number must be at least 10 digits";
                    isValid = false;
                } else if (cleanedNum.replace(/\D/g, "").length > 15) {
                    contactErrors[originalIndex] = "Phone number cannot exceed 15 digits";
                    isValid = false;
                }
            });
        }

        if (contactErrors.some((error) => error)) {
            newErrors.contactNumbers = contactErrors;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof ValidationErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleToggleActive = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleContactChange = (index: number, value: string) => {
        const newContacts = [...contactNumbers];
        newContacts[index] = value;
        setContactNumbers(newContacts);

        // Clear error for this specific contact
        if (errors.contactNumbers && errors.contactNumbers[index]) {
            const newContactErrors = [...(errors.contactNumbers || [])];
            newContactErrors[index] = "";
            setErrors((prev) => ({ ...prev, contactNumbers: newContactErrors }));
        }
    };

    const addContact = () => {
        setContactNumbers([...contactNumbers, ""]);
    };

    const removeContact = (index: number) => {
        if (contactNumbers.length > 1) {
            const newContacts = contactNumbers.filter((_, i) => i !== index);
            setContactNumbers(newContacts);

            // Remove error for this contact if it exists
            if (errors.contactNumbers) {
                const newContactErrors = errors.contactNumbers.filter((_, i) => i !== index);
                setErrors((prev) => ({ ...prev, contactNumbers: newContactErrors }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstErrorField = document.querySelector(".border-red-500");
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        setLoading(true);

        try {
            const payload = {
                buildingName: formData.buildingName.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                area: formData.area.trim(),
                isActive: formData.isActive,
                contactNumbers: contactNumbers.filter((num) => num.trim() !== "").map((num) => num.trim()),
            };

            const res = await updateBuilding(payload, building._id);
            const updatedBuilding = res?.data;

            if (updatedBuilding) {
                onUpdate(updatedBuilding);
                toast.success("Building updated successfully");
                onClose();
            }
        } catch (error: any) {
            console.error("Error updating building:", error);
            toast.error(error?.response?.data?.message || "Failed to update building");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get error styling
    const getErrorClass = (fieldName: keyof ValidationErrors) => {
        return errors[fieldName] ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:border-transparent";
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-brand-500 dark:bg-brand-600 px-6 py-5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Edit Building</h2>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-5">
                        {/* Building Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Building Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="buildingName"
                                placeholder="Enter building name"
                                value={formData.buildingName}
                                onChange={handleChange}
                                required
                                className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-all duration-200 ${getErrorClass(
                                    "buildingName"
                                )}`}
                            />
                            {errors.buildingName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.buildingName}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter building address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-all duration-200 ${getErrorClass(
                                    "address"
                                )}`}
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
                        </div>

                        {/* City & Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-all duration-200 ${getErrorClass(
                                        "city"
                                    )}`}
                                />
                                {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Area <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="area"
                                    placeholder="Enter area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    required
                                    className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-all duration-200 ${getErrorClass(
                                        "area"
                                    )}`}
                                />
                                {errors.area && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.area}</p>}
                            </div>
                        </div>

                        {/* Contact Numbers */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <Phone size={16} />
                                    Contact Numbers <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addContact}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-md"
                                >
                                    <Plus size={16} />
                                    Add Contact
                                </button>
                            </div>

                            <div className="space-y-3">
                                {contactNumbers.map((num, index) => (
                                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Enter contact number (e.g., +1234567890)"
                                                    value={num}
                                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                                    className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-all duration-200 ${
                                                        errors.contactNumbers && errors.contactNumbers[index]
                                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                                            : "border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:border-transparent"
                                                    }`}
                                                />
                                                {errors.contactNumbers && errors.contactNumbers[index] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactNumbers[index]}</p>}
                                            </div>
                                            {contactNumbers.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeContact(index)}
                                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 self-start"
                                                    title="Remove"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.contactNumbers && typeof errors.contactNumbers === "string" && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactNumbers}</p>}
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Format: +1234567890 or 01234567890. At least one contact number is required.</p>
                        </div>

                        {/* Active Status Toggle */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Active Status</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formData.isActive ? "This building is currently active" : "This building is currently inactive"}</p>
                                </div>
                                <Switch checked={formData.isActive} onChange={handleToggleActive} />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Updating...
                            </span>
                        ) : (
                            "Update Building"
                        )}
                    </button>

                    <PackageSelector handleSubmit={()=>{}} setFormData={setFormData}  />
                </div>
            </div>
        </div>
    );
}

export default BuildingEditModal;
