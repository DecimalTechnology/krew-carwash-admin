import React, { useState, useEffect } from "react";
import { IVehicle } from "../../interface/IVehicle";
import Switch from "../ui/switch/Switch";

interface VehicleEditModalProps {
  isOpen: boolean;
  vehicle: IVehicle | null;
  onClose: () => void;
  onSave: (formData: FormData) => void; // now sending FormData
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
      setImageFile(null); // reset file input
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Preview
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
    if (imageFile) formData.append("image", imageFile); // only append new file

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Vehicle</h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            className="w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Image</label>
          {imagePreview && <img src={imagePreview} alt="preview" className="w-full h-32 object-cover mb-2 rounded" />}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-gray-700 dark:text-gray-300">Active Status</label>
          <Switch checked={isActive} onChange={(checked) => setIsActive(checked)} />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] hover:from-[#3a7d74] hover:to-[#5DB7AE] text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleEditModal;
