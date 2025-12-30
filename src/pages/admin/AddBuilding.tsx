"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createBuilding } from "../../api/admin/buildingService";
import Switch from "../../components/ui/switch/Switch";
import PackageSelector from "../../components/building/PackageSelector";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import toast from "react-hot-toast";

// Validation error type
interface ValidationErrors {
  buildingName?: string;
  address?: string;
  city?: string;
  area?: string;
  contactNumbers?: string;
  packages?: string;
  general?: string;
}

function AddBuildingPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const [formData, setFormData] = useState({
        buildingName: "",
        address: "",
        city: "",
        area: "",
        isActive: true,
        contactNumbers: [""],
        packages: [],
    });

    // Clear validation errors when form data changes
    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors({});
        }
    }, [formData]);

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let isValid = true;

        // Validate building name
        if (!formData.buildingName.trim()) {
            errors.buildingName = "Building name is required";
            isValid = false;
        } else if (formData.buildingName.trim().length < 2) {
            errors.buildingName = "Building name must be at least 2 characters";
            isValid = false;
        } else if (formData.buildingName.trim().length > 100) {
            errors.buildingName = "Building name cannot exceed 100 characters";
            isValid = false;
        }

        // Validate address
        if (formData.address && formData.address.trim().length > 200) {
            errors.address = "Address cannot exceed 200 characters";
            isValid = false;
        }

        // Validate city
        if (!formData.city.trim()) {
            errors.city = "City is required";
            isValid = false;
        } else if (formData.city.trim().length < 2) {
            errors.city = "City must be at least 2 characters";
            isValid = false;
        } else if (formData.city.trim().length > 50) {
            errors.city = "City cannot exceed 50 characters";
            isValid = false;
        }

        // Validate area
        if (!formData.area.trim()) {
            errors.area = "Area is required";
            isValid = false;
        } else if (formData.area.trim().length < 2) {
            errors.area = "Area must be at least 2 characters";
            isValid = false;
        } else if (formData.area.trim().length > 50) {
            errors.area = "Area cannot exceed 50 characters";
            isValid = false;
        }

        // Validate contact numbers
        const validContacts = formData.contactNumbers.filter(num => num.trim() !== "");
        
        if (validContacts.length === 0) {
            errors.contactNumbers = "At least one contact number is required";
            isValid = false;
        } else {
            // Validate each contact number format
            for (const contact of validContacts) {
                // Remove spaces, dashes, and parentheses
                const cleanNumber = contact.replace(/[\s\-()]/g, '');
                
                // Check if it's a valid phone number (8-15 digits, may start with +)
                const phoneRegex = /^\+?[0-9]{8,15}$/;
                
                if (!phoneRegex.test(cleanNumber)) {
                    errors.contactNumbers = `Invalid phone number format: ${contact}. Must be 8-15 digits`;
                    isValid = false;
                    break;
                }
            }
        }

        // Validate duplicate contact numbers
        const uniqueContacts = new Set(validContacts.map(num => num.trim()));
        if (uniqueContacts.size !== validContacts.length) {
            errors.contactNumbers = "Duplicate contact numbers are not allowed";
            isValid = false;
        }

        // Validate packages
        if (!formData.packages || formData.packages.length === 0) {
            errors.packages = "At least one package is required";
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Special handling for numeric fields (if needed)
        let processedValue = value;
        
        setFormData((prev) => ({ 
            ...prev, 
            [name]: processedValue 
        }));
    };

    const handleToggleActive = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleContactChange = (index: number, value: string) => {
        // Allow only numbers, plus sign, spaces, dashes, and parentheses
        const sanitizedValue = value.replace(/[^0-9+\-\s()]/g, '');
        
        const newContacts = [...formData.contactNumbers];
        newContacts[index] = sanitizedValue;
        setFormData((prev) => ({ ...prev, contactNumbers: newContacts }));
    };

    const addContact = () => {
        if (formData.contactNumbers.length < 5) {
            setFormData((prev) => ({
                ...prev,
                contactNumbers: [...prev.contactNumbers, ""],
            }));
        }
    };

    const removeContact = (index: number) => {
        if (formData.contactNumbers.length > 1) {
            const newContacts = formData.contactNumbers.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, contactNumbers: newContacts }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            // Scroll to first error
            const firstErrorElement = document.querySelector('.error-message');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                buildingName: formData.buildingName.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                area: formData.area.trim(),
                isActive: formData.isActive,
                contactNumbers: formData.contactNumbers
                    .filter((num) => num.trim() !== "")
                    .map(num => num.trim()),
                packages: formData?.packages,
            };

            const res = await createBuilding(payload);
            if (res?.success) {
                // Show success message
                toast.success("Building created successfully!");
                navigate("/building");
            } else {
                // Handle API error
                setValidationErrors({
                    general: res?.message || "Failed to create building. Please try again."
                });
            }
        } catch (error: any) {
            console.error("Building creation error:", error);
            setValidationErrors({
                general: error.message || "An unexpected error occurred. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSubmitting) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10" onKeyDown={handleKeyDown}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <Breadcrumb
                    pageName="Add Building"
                    elements={[
                        { page: "Home", path: "/" },
                        { page: "Buildings", path: "/building" },
                        { page: "Add Building", path: "" },
                    ]}
                />

                {/* General Error */}
                {validationErrors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg error-message">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">{validationErrors.general}</span>
                        </div>
                    </div>
                )}

                {/* Form Section */}
                <div className="bg-white shadow-lg rounded-2xl mt-8">
                    <form className="p-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Building Name */}
                                <div className="error-message">
                                    <label className="block text-base font-semibold text-gray-800 mb-2">
                                        Building Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="buildingName"
                                        placeholder="Enter building name"
                                        value={formData.buildingName}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        className={`w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none transition-colors ${
                                            validationErrors.buildingName 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-brand-500'
                                        }`}
                                    />
                                    {validationErrors.buildingName && (
                                        <div className="mt-1 flex items-center">
                                            <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-red-600">{validationErrors.buildingName}</span>
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-gray-500 text-right">
                                        {formData.buildingName.length}/100 characters
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-800 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter building address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        maxLength={200}
                                        className={`w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none transition-colors ${
                                            validationErrors.address 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-brand-500'
                                        }`}
                                    />
                                    {validationErrors.address && (
                                        <div className="mt-1 flex items-center">
                                            <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-red-600">{validationErrors.address}</span>
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-gray-500 text-right">
                                        {formData.address.length}/200 characters
                                    </div>
                                </div>

                                {/* City & Area */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            maxLength={50}
                                            className={`w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none transition-colors ${
                                                validationErrors.city 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:ring-brand-500'
                                            }`}
                                        />
                                        {validationErrors.city && (
                                            <div className="mt-1 flex items-center">
                                                <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{validationErrors.city}</span>
                                            </div>
                                        )}
                                        <div className="mt-1 text-xs text-gray-500 text-right">
                                            {formData.city.length}/50 characters
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Area <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            placeholder="Enter area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            required
                                            maxLength={50}
                                            className={`w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none transition-colors ${
                                                validationErrors.area 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:ring-brand-500'
                                            }`}
                                        />
                                        {validationErrors.area && (
                                            <div className="mt-1 flex items-center">
                                                <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-red-600">{validationErrors.area}</span>
                                            </div>
                                        )}
                                        <div className="mt-1 text-xs text-gray-500 text-right">
                                            {formData.area.length}/50 characters
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Contact Numbers */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-base font-semibold text-gray-800">
                                            Contact Numbers <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {formData.contactNumbers.filter(num => num.trim() !== "").length}/5 contacts
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.contactNumbers.map((num, index) => (
                                            <div key={index} className="flex gap-3 items-start">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., +971 50 123 4567"
                                                        value={num}
                                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                                        maxLength={20}
                                                        className={`w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-[#4B164C] outline-none transition-colors ${
                                                            validationErrors.contactNumbers && index === 0
                                                            ? 'border-red-500 focus:ring-red-500' 
                                                            : 'border-gray-300 focus:ring-[#4B164C]'
                                                        }`}
                                                    />
                                                    {validationErrors.contactNumbers && index === 0 && (
                                                        <div className="mt-1 flex items-center">
                                                            <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm text-red-600">{validationErrors.contactNumbers}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {formData.contactNumbers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeContact(index)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                                                        disabled={isSubmitting}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={addContact}
                                        disabled={formData.contactNumbers.length >= 5 || isSubmitting}
                                        className="mt-3 px-5 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        + Add Contact
                                    </button>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Maximum 5 contact numbers allowed
                                    </div>
                                </div>

                                {/* Active Status */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-base font-semibold text-gray-800 mb-1">Building Status</label>
                                            <p className="text-sm text-gray-500">Set the building as active or inactive</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Switch 
                                                checked={formData.isActive} 
                                                onChange={handleToggleActive} 
                                                disabled={isSubmitting}
                                            />
                                            <span className={`text-base font-semibold ${formData.isActive ? "text-green-600" : "text-red-600"}`}>
                                                {formData.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    
                    {/* Package Selector with validation */}
                    <div className="px-8 pb-8">
                        {validationErrors.packages && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700 font-medium">{validationErrors.packages}</span>
                                </div>
                            </div>
                        )}
                        
                        <PackageSelector 
                            handleSubmit={handleSubmit} 
                            setFormData={setFormData}
                            isSubmitting={isSubmitting}
                            validationError={validationErrors.packages}
                        />
                        
                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/building")}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 text-sm font-medium transition-colors disabled:bg-brand-300 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Building'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBuildingPage;