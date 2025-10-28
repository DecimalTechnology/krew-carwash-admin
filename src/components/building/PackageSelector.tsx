import { useEffect, useState } from "react";
import Select from "react-select";
import { IPackage } from "../../interface/IPackage";
import { getPackages } from "../../api/admin/packageService";

function PackageSelector() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);

  // Fetch package list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPackages();

    
        setPackages(res?.data || []);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Convert to react-select options
  const options = packages.map((pkg) => ({
    value: pkg._id,
    label: `${pkg.name} (${pkg.frequency})`,
  }));

  // Find currently selected options
  const selectedOptions = options.filter((opt) => 
    selectedPackageIds.includes(opt.value)
  );

  const handleSelection = (selectedOptions: any) => {
    const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelectedPackageIds(selectedIds);
    console.log("Selected packages:", selectedIds);
  };

  return (
    <div className="flex flex-col gap-2 w-full mb-8">
      <label htmlFor="package" className="text-sm font-medium text-gray-700">
        Select Packages
      </label>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading packages...</p>
      ) : (
        <Select
          id="package"
          options={options}
          value={selectedOptions}
          onChange={handleSelection}
          placeholder="-- Choose Packages --"
          isMulti
          isClearable
          className="text-sm"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#d1d5db",
              boxShadow: "none",
              "&:hover": { borderColor: "#2563eb" },
              borderRadius: "0.5rem",
              padding: "2px",
            }),
          }}
        />
      )}
    </div>
  );
}

export default PackageSelector;