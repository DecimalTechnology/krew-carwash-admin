/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Select from "react-select";
import { IPackage } from "../../interface/IPackage";
import PackageList from "./PackageList";
import { getAllPackages } from "../../api/admin/packageService";

interface IProps {
    setFormData: React.Dispatch<
        React.SetStateAction<{
            buildingName: string;
            address: string;
            city: string;
            area: string;
            isActive: boolean;
            contactNumbers: string[];
            packages: never[];
        }>
    >;
 handleSubmit:()=>void
}

function PackageSelector({ setFormData ,handleSubmit}: IProps) {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackages, setSelectedPackages] = useState<IPackage[]>([]);

    // Fetch all packages
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllPackages();
                setPackages(res?.data || []);
            } catch (err) {
                console.error("Error fetching packages:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Convert packages to react-select options
    const options = packages.map((pkg) => ({
        value: pkg._id,
        label: `${pkg.name} (${pkg.frequency})`,
    }));

    // Handle selection
    const handleSelection = (selectedOptions: any) => {
        const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];

        // Get the full objects
        const selectedFullPackages = packages.filter((pkg) => selectedIds.includes(pkg._id));
        setSelectedPackages(selectedFullPackages);
    };

    return (
        <div className="flex flex-col gap-4 w-full mb-8 p-8 bg-white shadow-md rounded-2xl">
            <label htmlFor="package" className="text-sm font-semibold text-gray-700">
                Select Packages
            </label>

            {loading ? (
                <p className="text-gray-500 text-sm animate-pulse">Loading packages...</p>
            ) : (
                <Select
                    id="package"
                    options={options}
                    onChange={handleSelection}
                    placeholder="-- Choose Packages --"
                    isMulti
                    isClearable
                    className="text-sm"
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            borderColor: state.isFocused ? "#4B164C" : "#d1d5db",
                            boxShadow: state.isFocused ? "0 0 0 2px rgba(75,22,76,0.2)" : "none",
                            "&:hover": { borderColor: "#4B164C" },
                            borderRadius: "0.75rem",
                            padding: "2px",
                            minHeight: "44px",
                        }),
                    }}
                />
            )}

            {selectedPackages?.length > 0 && <PackageList setFormData={setFormData} selectedPackages={selectedPackages} />}
            {/* <div className="flex justify-end mt-10">
                <button
                   onClick={handleSubmit}
                    type="submit"
                    className="px-8 py-3 bg-[#67C6BA] text-white font-semibold rounded-lg shadow-md  transition duration-300"
                >
                    Save
                </button>
            </div> */}
        </div>
    );
}

export default PackageSelector;