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
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Vehicle</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image</label>
          {imagePreview && <img src={imagePreview} alt="preview" className="w-full h-32 object-cover mb-2 rounded" />}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-gray-700">Active Status</label>
          <Switch checked={isActive} onChange={(checked) => setIsActive(checked)} />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
