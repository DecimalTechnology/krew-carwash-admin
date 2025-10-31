import React, { useState, useEffect } from "react";
import { IVehicle } from "../../interface/IVehicle";
import Switch from "../ui/switch/Switch";
import { X, Upload, Image as ImageIcon, Car } from "lucide-react";

interface VehicleEditModalProps {
  isOpen: boolean;
  vehicle: IVehicle | null;
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

const VehicleEditModal: React.FC<VehicleEditModalProps> = ({ isOpen, vehicle, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name);
      setDescription(vehicle.description || "");
      setImagePreview(vehicle.image || null);
      setIsActive(vehicle.isActive);
      setImageFile(null);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isActive", isActive.toString());
    if (imageFile) formData.append("image", imageFile);

    onSave(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Edit Vehicle Type</h2>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Vehicle Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Vehicle Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Sedan, SUV, Truck..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the vehicle type..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Vehicle Image
            </label>
            
            {imagePreview ? (
              <div className="relative group">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-full h-56 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <label className="cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Change Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="text-brand-600 dark:text-brand-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Active Status
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isActive ? "This vehicle type is currently active" : "This vehicle type is currently inactive"}
                </p>
              </div>
              <Switch checked={isActive} onChange={(checked) => setIsActive(checked)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleEditModal;
