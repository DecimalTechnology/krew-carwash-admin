import { useState, useEffect } from "react";
import Switch from "../ui/switch/Switch";
import { updatePackage } from "../../api/admin/packageService";
import { getAllVehicles } from "../../api/admin/vehicleTypeServices";
import { IPackage } from "../../interface/IPackage";
import toast from "react-hot-toast";
import { Plus, X, Package } from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
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
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Premium Wash, Basic Service..."
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Brief description of the package..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Base Prices */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vehicle Pricing <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addBasePrice}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-md"
                >
                  <Plus size={16} />
                  Add Price
                </button>
              </div>

              <div className="space-y-3">
                {basePrices.map((basePrice, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                        Vehicle Type
                      </label>
                      <select
                        value={basePrice.vehicleType}
                        onChange={(e) => handleBasePriceChange(index, "vehicleType", e.target.value)}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                      />
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
                ))}
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Active Status
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.isActive ? "This package is currently active" : "This package is currently inactive"}
                  </p>
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
            {loading ? "Updating..." : "Update Package"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPackageModal;
