import { useState, useEffect } from "react";
import Switch from "../ui/switch/Switch";
import { updatePackage } from "../../api/admin/packageService";
import { getAllVehicles } from "../../api/admin/vehicleService";
import { IPackage } from "../../interface/IPackage";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

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

function EditPackageModal({ isOpen, package: pkg, onClose, onUpdate }: IProps) {
  const [formData, setFormData] = useState({
    name: "",
    frequency: "1 Time" as "1 Time" | "8 Times" | "12 Times",
    description: "",
    isActive: true,
  });

  const [basePrices, setBasePrices] = useState<IBasePrice[]>([
    { vehicleType: "", price: "" },
  ]);

  const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
  const [loading, setLoading] = useState(false);

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
    }
  }, [pkg]);

  if (!isOpen || !pkg) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleBasePriceChange = (index: number, field: "vehicleType" | "price", value: string | number) => {
    const newBasePrices = [...basePrices];
    newBasePrices[index] = { ...newBasePrices[index], [field]: value };
    setBasePrices(newBasePrices);
  };

  const addBasePrice = () => {
    setBasePrices([...basePrices, { vehicleType: "", price: "" }]);
  };

  const removeBasePrice = (index: number) => {
    if (basePrices.length > 1) {
      setBasePrices(basePrices.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrices: basePrices
          .filter((bp) => bp.vehicleType && bp.price)
          .map((bp) => ({
            vehicleType: bp.vehicleType,
            price: typeof bp.price === 'string' ? parseFloat(bp.price) : bp.price,
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
      // Error toast is already shown by the service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95%] max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5DB7AE] dark:text-[#6ECFC3]">
          Edit Package
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Name */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Package Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter package name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="1 Time">1 Time</option>
              <option value="8 Times">8 Times</option>
              <option value="12 Times">12 Times</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              placeholder="Enter package description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Base Prices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Base Prices</label>
              <button
                type="button"
                onClick={addBasePrice}
                className="flex items-center gap-1 px-3 py-1 bg-[#5DB7AE] text-white rounded-lg hover:bg-[#4a9d91] transition text-sm"
              >
                <Plus size={16} />
                Add Price
              </button>
            </div>

            <div className="space-y-3">
              {basePrices.map((basePrice, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={basePrice.vehicleType}
                      onChange={(e) => handleBasePriceChange(index, "vehicleType", e.target.value)}
                      required
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map((vt) => (
                        <option key={vt._id} value={vt._id}>
                          {vt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Price (AED)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={basePrice.price}
                      onChange={(e) => handleBasePriceChange(index, "price", e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {basePrices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBasePrice(index)}
                      className="mt-6 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Remove"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700 dark:text-gray-300">Status</label>
            <Switch checked={formData.isActive} onChange={handleToggleActive} />
            <span className="text-gray-700 dark:text-gray-300">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPackageModal;

