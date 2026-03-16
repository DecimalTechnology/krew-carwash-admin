import { useEffect, useState } from "react";
import Select from "react-select";
import { getAllPackagesUnderBuilding, updatePackageInBuilding } from "../../api/admin/buildingService";
import { getAllPackages } from "../../api/admin/packageService";
import toast from "react-hot-toast";

interface IProps {
    buildingId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

function EditPackageUnderBuildingModal({ buildingId, onClose, onSuccess }: IProps) {
    const [packages, setPackages] = useState<any[]>([]);
    const [packageList, setPackageList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [buildingPackagesRes, allPackagesRes] = await Promise.all([
                    getAllPackagesUnderBuilding(buildingId),
                    getAllPackages()
                ]);
                
                setPackageList(allPackagesRes?.data || []);
                setPackages(buildingPackagesRes?.data?.packages || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load packages");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [buildingId]);

    const handlePriceChange = (packageId: string, vehicleTypeId: string, value: string) => {
        const numValue = parseFloat(value);
        if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
            setPackages((prevPackages) =>
                prevPackages.map((pkg: any) => {
                    if (pkg?.packageId?._id === packageId) {
                        return {
                            ...pkg,
                            prices: pkg.prices.map((pr: any) => {
                                if (pr?.vehicleType?._id === vehicleTypeId) {
                                    return { ...pr, price: value === '' ? '' : numValue };
                                }
                                return pr;
                            }),
                        };
                    }
                    return pkg;
                }),
            );
        }
    };

    const handleSave = async () => {
        // Validate all prices are filled
        let hasEmptyPrices = false;
        packages.forEach((pkg: any) => {
            pkg.prices.forEach((pr: any) => {
                if (pr.price === '' || pr.price === null || pr.price === undefined) {
                    hasEmptyPrices = true;
                }
            });
        });

        if (hasEmptyPrices) {
            toast.error("Please fill in all price fields");
            return;
        }

        setSubmitting(true);
        try {
            const newPackages = packages?.map((pkg: any) => {
                const prices = pkg?.prices.map((obj: any) => ({ 
                    vehicleType: obj?.vehicleType?._id, 
                    price: Number(obj?.price) 
                }));
                return { packageId: pkg?.packageId?._id, prices: prices };
            });

            const res = await updatePackageInBuilding(buildingId, newPackages);
            
            if (res?.success) {
                toast.success("Packages updated successfully!");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                toast.error(res?.message || "Failed to update packages");
            }
        } catch (error: any) {
            console.error("Error updating packages:", error);
            toast.error(error.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const onPackageChange = (selectedOption: any) => {
        if (!selectedOption) return;
        
        const packageId = selectedOption.value;
        const exists = packages.some((obj: any) => obj?.packageId?._id === packageId);
        
        if (!exists) {
            const pkg = packageList.find((obj: any) => obj?._id.toString() === packageId);
            
            // Create prices array based on first package's vehicle types or empty array
            const prices = packages.length > 0 
                ? packages[0].prices.map((obj: any) => ({ 
                    ...obj, 
                    price: "",
                    vehicleType: obj.vehicleType 
                }))
                : [];
            
            const newPackage = { 
                packageId: pkg, 
                prices: prices,
                _id: Date.now().toString() // temporary id
            };
            setPackages([...packages, newPackage]);
        } else {
            toast.error("Package already added");
        }
    };

    const handleDeletePackage = (packageId: string) => {
        if (packages.length <= 1) {
            toast.error("At least one package is required");
            return;
        }
        setPackages((prev: any) => prev.filter((pkg: any) => pkg?.packageId?._id !== packageId));
    };

    // Prepare options for react-select
    const packageOptions = packageList
        .filter(pkg => !packages.some(existingPkg => existingPkg?.packageId?._id === pkg?._id))
        .map(pkg => ({
            value: pkg._id,
            label: pkg.name
        }));

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-lg p-12">
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading packages...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            {/* Modal */}
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-lg max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Building Packages</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-medium transition-colors"
                        disabled={submitting}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Add Package Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Add New Package
                        </label>
                        <Select
                            options={packageOptions}
                            onChange={onPackageChange}
                            placeholder="-- Select a package to add --"
                            isClearable
                            isDisabled={submitting || packageOptions.length === 0}
                            className="text-sm"
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderColor: state.isFocused ? "#4B164C" : "#d1d5db",
                                    boxShadow: state.isFocused ? "0 0 0 2px rgba(75,22,76,0.2)" : "none",
                                    "&:hover": { borderColor: "#4B164C" },
                                    borderRadius: "0.5rem",
                                    padding: "2px",
                                }),
                            }}
                        />
                        {packageOptions.length === 0 && (
                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                                All available packages have been added
                            </p>
                        )}
                    </div>

                    {/* Packages List */}
                    {packages.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No packages added yet</p>
                        </div>
                    ) : (
                        packages?.map((pkg: any) => (
                            <div key={pkg?.packageId?._id} className="border rounded-lg p-4 dark:border-gray-700 hover:shadow-md transition-shadow">
                                {/* Package Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                                            <span className="text-brand-600 dark:text-brand-400 font-semibold">
                                                {pkg?.packageId?.name?.charAt(0) || 'P'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                                {pkg?.packageId?.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {pkg?.packageId?.frequency || 'Package'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePackage(pkg?.packageId?._id)}
                                        disabled={submitting || packages.length <= 1}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                        title="Remove package"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Prices Table */}
                                <div className="mt-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {pkg?.prices?.map((pr: any, index: number) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {pr?.vehicleType?.name}
                                                </label>
                                                <div className="relative">
                                                 
                                                    <input
                                                        type="number"
                                                        value={pr?.price === '' ? '' : pr?.price}
                                                        onChange={(e) => handlePriceChange(
                                                            pkg?.packageId?._id, 
                                                            pr?.vehicleType?._id, 
                                                            e.target.value
                                                        )}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        disabled={submitting}
                                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t dark:border-gray-700 px-6 py-4 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={submitting || packages.length === 0}
                        className="px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:bg-brand-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPackageUnderBuildingModal;