import { useEffect, useState } from "react";
import { IPackage } from "../../interface/IPackage";
import { getAllVehicles } from "../../api/admin/vehicleTypeServices";

interface PackageListProps {
    selectedPackages: IPackage[];
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

function PackageList({ selectedPackages, setFormData }: PackageListProps) {
    const [vehicleTypes, setVehicleTypes] = useState<Record<string, any>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllVehicles();
            setVehicleTypes(res?.data);
        };
        fetchData();
    }, []);

    const changePrice = (packageId: string, vehicleId: string, value: number) => {
        setFormData((prev: any) => {
            const updatedPackages = [...(prev.packages || [])];
            const pkgIndex = updatedPackages.findIndex((p) => p.packageId === packageId);

            if (pkgIndex !== -1) {
                // package exists
                const pkg = { ...updatedPackages[pkgIndex] };
                const priceIndex = pkg.prices.findIndex((p: any) => p.vehicleType === vehicleId);

                if (priceIndex !== -1) {
                    // update existing
                    pkg.prices[priceIndex].price = value;
                } else {
                    // add new vehicle type price
                    pkg.prices.push({ vehicleType: vehicleId, price: value });
                }

                updatedPackages[pkgIndex] = pkg;
            } else {
                // add new package
                updatedPackages.push({
                    packageId,
                    prices: [{ vehicleType: vehicleId, price: value }],
                });
            }

            return { ...prev, packages: updatedPackages };
        });
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#4B164C] mb-5 border-b pb-2 border-gray-200">
                Selected Package Details
            </h3>

            <div className="space-y-6">
                {selectedPackages.map((pkg) => (
                    <div
                        key={pkg._id}
                        className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 bg-white"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xl font-semibold text-[#4B164C]">{pkg.name}</h4>
                            <span className="px-3 py-1 bg-[#4B164C]/10 text-[#4B164C] text-xs font-medium rounded-full">
                                {pkg.frequency}
                            </span>
                        </div>

                        {/* Description */}
                        {pkg.description && (
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pkg.description}</p>
                        )}

                        {/* Vehicle Types + Price Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
                            {vehicleTypes?.map((type: any) => (
                                <div
                                    key={type?._id}
                                    className="border border-gray-100 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {type?.name}
                                    </label>
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            changePrice(pkg._id, type._id, Number(e.target.value))
                                        }
                                        placeholder="Enter price"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4B164C] focus:border-[#4B164C] outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PackageList;
