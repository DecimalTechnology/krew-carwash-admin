import { useState, useEffect } from "react";
import Switch from "../ui/switch/Switch";
import { updatePackage } from "../../api/admin/packageService";
import { getAllVehicles } from "../../api/admin/vehicleTypeServices";
import { IPackage } from "../../interface/IPackage";
import toast from "react-hot-toast";
import { Plus, X, Package, AlertCircle } from "lucide-react";

interface IProps {
    isOpen: boolean;
    package: IPackage | null;
    onClose: () => void;
    onUpdate: (updatedPackage: IPackage) => void;
}

interface IVehicleType {
    _id: string;
    name: string;
}

interface IBasePrice {
    vehicleType: string;
    price: number | string;
}

interface IFormErrors {
    name?: string;
    description?: string;
    basePrices?: string;
}

function EditPackageModal({ isOpen, package: pkg, onClose, onUpdate }: IProps) {
    const [formData, setFormData] = useState({
        name: "",
        frequency: "1 Time" as "1 Time" | "8 Times" | "12 Times",
        description: "",
        isActive: true,
        isAddOn: false,
    });

    const [basePrices, setBasePrices] = useState<IBasePrice[]>([{ vehicleType: "", price: "" }]);

    const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IFormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                const res = await getAllVehicles();
                setVehicleTypes(res?.data || []);
            } catch (error) {
                toast.error("Failed to fetch vehicle types");
            }
        };
        if (isOpen) {
            fetchVehicleTypes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (pkg) {
            setFormData({
                name: pkg.name,
                frequency: pkg.frequency,
                description: pkg.description || "",
                isActive: pkg.isActive,
                isAddOn: pkg.isAddOn || false,
            });

            if (pkg.basePrices && pkg.basePrices.length > 0) {
                setBasePrices(
                    pkg.basePrices.map((bp) => ({
                        vehicleType: typeof bp.vehicleType === "object" ? bp.vehicleType._id : bp.vehicleType,
                        price: bp.price,
                    }))
                );
            } else {
                setBasePrices([{ vehicleType: "", price: "" }]);
            }

            // Reset errors and touched states
            setErrors({});
            setTouched({});
        }
    }, [pkg]);

    if (!isOpen || !pkg) return null;

    // Validation functions
    const validateName = (name: string): string => {
        if (!name.trim()) return "Package name is required";
        if (name.length < 2) return "Package name must be at least 2 characters";
        if (name.length > 50) return "Package name must be less than 50 characters";
        return "";
    };

    const validateDescription = (description: string): string => {
        if (!description.trim()) return "Description is required";
        if (description.trim().length < 10) return "Description must be at least 10 characters";
        if (description.length > 500) return "Description must be less than 500 characters";
        return "";
    };

    const validateBasePrices = (prices: IBasePrice[]): string => {
        if (prices.length === 0) return "At least one vehicle price is required";

        // Check for empty vehicle types or prices
        const hasEmptyFields = prices.some((bp) => !bp.vehicleType || bp.price === "" || bp.price === 0);
        if (hasEmptyFields) return "All vehicle types and prices must be filled";

        // Check for duplicate vehicle types
        const vehicleTypeIds = prices.map((bp) => bp.vehicleType).filter((id) => id);
        const uniqueVehicleTypes = new Set(vehicleTypeIds);
        if (vehicleTypeIds.length !== uniqueVehicleTypes.size) {
            return "Duplicate vehicle types are not allowed";
        }

        // Check for valid prices
        const hasInvalidPrice = prices.some((bp) => {
            const price = typeof bp.price === "string" ? parseFloat(bp.price) : bp.price;
            return price <= 0 || price > 10000;
        });
        if (hasInvalidPrice) return "Prices must be between 0.01 and 10000 AED";

        return "";
    };

    // Get available vehicle types for dropdown (exclude already selected ones)
    const getAvailableVehicleTypes = (currentIndex: number) => {
        const selectedVehicleTypes = basePrices
            .filter((_, index) => index !== currentIndex)
            .map((bp) => bp.vehicleType)
            .filter((id) => id);

        return vehicleTypes.filter((vt) => !selectedVehicleTypes.includes(vt._id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof IFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }

        // Validate on change for immediate feedback
        if (name === "name") {
            const error = validateName(value);
            if (error && touched[name]) {
                setErrors((prev) => ({ ...prev, [name]: error }));
            }
        } else if (name === "description") {
            const error = validateDescription(value);
            if (error && touched[name]) {
                setErrors((prev) => ({ ...prev, [name]: error }));
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate the specific field
        let error = "";
        if (name === "name") {
            error = validateName(formData.name);
        } else if (name === "description") {
            error = validateDescription(formData.description);
        }

        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else if (errors[name as keyof IFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleToggleActive = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleToggleAddOn = () => {
        setFormData((prev) => ({ ...prev, isAddOn: !prev.isAddOn }));
    };

    const handleBasePriceChange = (index: number, field: "vehicleType" | "price", value: string | number) => {
        const newBasePrices = [...basePrices];
        newBasePrices[index] = { ...newBasePrices[index], [field]: value };
        setBasePrices(newBasePrices);

        // Clear base prices error when user makes changes
        if (errors.basePrices) {
            setErrors((prev) => ({ ...prev, basePrices: undefined }));
        }
    };

    const addBasePrice = () => {
        const availableVehicleTypes = getAvailableVehicleTypes(-1);
        if (availableVehicleTypes.length === 0) {
            toast.error("All vehicle types have been added");
            return;
        }
        setBasePrices([...basePrices, { vehicleType: "", price: "" }]);
    };

    const removeBasePrice = (index: number) => {
        if (basePrices.length > 1) {
            setBasePrices(basePrices.filter((_, i) => i !== index));
        }
        // Clear base prices error when removing
        if (errors.basePrices) {
            setErrors((prev) => ({ ...prev, basePrices: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: IFormErrors = {};

        // Validate name
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        // Validate description
        const descriptionError = validateDescription(formData.description);
        if (descriptionError) newErrors.description = descriptionError;

        // Validate base prices
        const basePricesError = validateBasePrices(basePrices);
        if (basePricesError) newErrors.basePrices = basePricesError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {
            name: true,
            description: true,
        };
        setTouched(allTouched);

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                description: formData.description.trim(),
                basePrices: basePrices
                    .filter((bp) => bp.vehicleType && bp.price)
                    .map((bp) => ({
                        vehicleType: bp.vehicleType,
                        price: typeof bp.price === "string" ? parseFloat(bp.price) : bp.price,
                    })),
            };

            const res = await updatePackage(pkg._id, payload);
            if (res?.success) {
                onUpdate(res.data);
                toast.success("Package updated successfully");
                onClose();
            }
        } catch (error: any) {
            console.error("Error updating package:", error);
            toast.error(error?.message || "Failed to update package");
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if field should show error
    const showError = (fieldName: keyof IFormErrors): boolean => {
        return touched[fieldName] && !!errors[fieldName];
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
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Edit Package</h2>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-5">
                        {/* Package Name */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Package Name <span className="text-red-500">*</span>
                                </label>
                                {showError("name") && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g., Premium Wash, Basic Service..."
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 ${
                                    showError("name") ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            />
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Frequency <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="1 Time">1 Time</option>
                                <option value="8 Times">8 Times</option>
                                <option value="12 Times">12 Times</option>
                            </select>
                        </div>

                        {/* Description - Required */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                {showError("description") && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.description}
                                    </span>
                                )}
                            </div>
                            <textarea
                                name="description"
                                placeholder="Describe the package details, features, and benefits..."
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                required
                                className={`w-full border rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none ${
                                    showError("description") ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/500 characters</div>
                                {formData.description.trim().length > 0 && formData.description.trim().length < 10 && <div className="text-xs text-amber-600">At least 10 characters required</div>}
                            </div>
                        </div>

                        {/* Base Prices */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Vehicle Pricing <span className="text-red-500">*</span>
                                    </label>
                                    {showError("basePrices") && (
                                        <span className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.basePrices}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={addBasePrice}
                                    disabled={getAvailableVehicleTypes(-1).length === 0}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                    Add Price
                                </button>
                            </div>

                            <div className="space-y-3">
                                {basePrices.map((basePrice, index) => {
                                    const availableVehicleTypes = getAvailableVehicleTypes(index);
                                    const selectedVehicle = vehicleTypes.find((vt) => vt._id === basePrice.vehicleType);

                                    return (
                                        <div
                                            key={index}
                                            className={`flex gap-3 items-start p-4 rounded-lg border ${
                                                showError("basePrices")
                                                    ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                                    : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Vehicle Type</label>
                                                <select
                                                    value={basePrice.vehicleType}
                                                    onChange={(e) => handleBasePriceChange(index, "vehicleType", e.target.value)}
                                                    required
                                                    className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 ${
                                                        !basePrice.vehicleType && showError("basePrices") ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                                                    }`}
                                                >
                                                    <option value="">Select Vehicle Type</option>
                                                    {availableVehicleTypes.map((vt) => (
                                                        <option key={vt._id} value={vt._id}>
                                                            {vt.name}
                                                        </option>
                                                    ))}
                                                    {selectedVehicle && !availableVehicleTypes.some((vt) => vt._id === selectedVehicle._id) && (
                                                        <option value={selectedVehicle._id}>{selectedVehicle.name} (selected)</option>
                                                    )}
                                                </select>
                                                {availableVehicleTypes.length === 0 && !basePrice.vehicleType && <p className="text-xs text-red-500 mt-1">No more vehicle types available</p>}
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Price (AED)</label>
                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    max="10000"
                                                    step="0.01"
                                                    value={basePrice.price}
                                                    onChange={(e) => handleBasePriceChange(index, "price", e.target.value)}
                                                    required
                                                    placeholder="0.00"
                                                    className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 ${
                                                        (basePrice.price === "" || basePrice.price === 0) && showError("basePrices")
                                                            ? "border-red-500 dark:border-red-500"
                                                            : "border-gray-300 dark:border-gray-600"
                                                    }`}
                                                />
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min: 0.01, Max: 10000</div>
                                            </div>

                                            {basePrices.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBasePrice(index)}
                                                    className="mt-7 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                                    title="Remove"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Toggle Section */}
                        <div className="space-y-4">
                            {/* Add-on Toggle */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Add-on Package</label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formData.isAddOn ? "This package is an add-on to existing packages" : "This is a standalone package"}
                                        </p>
                                    </div>
                                    <Switch checked={formData.isAddOn} onChange={handleToggleAddOn} />
                                </div>
                            </div>

                            {/* Active Status Toggle */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">Active Status</label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formData.isActive ? "This package is currently active" : "This package is currently inactive"}</p>
                                    </div>
                                    <Switch checked={formData.isActive} onChange={handleToggleActive} />
                                </div>
                            </div>
                        </div>

                        {/* Form-level error summary */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Please fix the errors above before submitting
                                </p>
                            </div>
                        )}
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
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${"bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white hover:shadow-lg"}`}
                    >
                        {loading ? "Updating..." : "Update Package"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPackageModal;
