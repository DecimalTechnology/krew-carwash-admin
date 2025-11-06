import { useState, useEffect } from "react";
import { IBuilding } from "../../interface/IBuilding";
import { Building2, X, Plus, Phone } from "lucide-react";
import Switch from "../ui/switch/Switch";
import toast from "react-hot-toast";
import { updateBuilding } from "../../api/admin/buildingService";

interface IProps {
  isOpen: boolean;
  building: IBuilding | null;
  onClose: () => void;
  onUpdate: (updatedBuilding: IBuilding) => void;
}

function BuildingEditModal({ isOpen, building, onClose, onUpdate }: IProps) {
  const [formData, setFormData] = useState({
    buildingName: "",
    address: "",
    city: "",
    area: "",
    isActive: true,
  });

  const [contactNumbers, setContactNumbers] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (building) {
      setFormData({
        buildingName: building.buildingName,
        address: building.address || "",
        city: building.city,
        area: building.area,
        isActive: building.isActive,
      });

      if (building.contactNumbers && building.contactNumbers.length > 0) {
        setContactNumbers(building.contactNumbers);
      } else {
        setContactNumbers([""]);
      }
    }
  }, [building]);

  if (!isOpen || !building) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...contactNumbers];
    newContacts[index] = value;
    setContactNumbers(newContacts);
  };

  const addContact = () => {
    setContactNumbers([...contactNumbers, ""]);
  };

  const removeContact = (index: number) => {
    if (contactNumbers.length > 1) {
      setContactNumbers(contactNumbers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        buildingName: formData.buildingName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        isActive: formData.isActive,
        contactNumbers: contactNumbers.filter((num) => num.trim() !== ""),
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
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Edit Building</h2>
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
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter building address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              />
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Contact Numbers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Phone size={16} />
                  Contact Numbers
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
                  <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <input
                      type="text"
                      placeholder="Enter contact number"
                      value={num}
                      onChange={(e) => handleContactChange(index, e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                    />
                    {contactNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
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
                    {formData.isActive ? "This building is currently active" : "This building is currently inactive"}
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
            {loading ? "Updating..." : "Update Building"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildingEditModal;

