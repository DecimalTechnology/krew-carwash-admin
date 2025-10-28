import { useState } from "react";
import Switch from "../ui/switch/Switch";
import { createBuilding } from "../../api/admin/buildingService";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  setBuildings: any;
}

function AddBuildingModal({ isOpen, onClose, setBuildings }: IProps) {
  const [formData, setFormData] = useState({
    buildingName: "",
    address: "",
    city: "",
    area: "",
    isActive: true,
    contactNumbers: [""],
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...formData.contactNumbers];
    newContacts[index] = value;
    setFormData((prev) => ({ ...prev, contactNumbers: newContacts }));
  };

  const addContact = () => {
    setFormData((prev) => ({ ...prev, contactNumbers: [...prev.contactNumbers, ""] }));
  };

  const removeContact = (index: number) => {
    const newContacts = formData.contactNumbers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, contactNumbers: newContacts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      buildingName: formData.buildingName.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      area: formData.area.trim(),
      isActive: formData.isActive,
      contactNumbers: formData.contactNumbers.filter((num) => num.trim() !== ""),
    };

    const res = await createBuilding(payload);
    if (res?.success) {
      setBuildings((prev: any) => [...prev, res.data]);
      onClose();
    }
  };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95%] max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold mb-6 text-center text-[#5DB7AE] dark:text-[#6ECFC3]">Add New Building</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Building Name */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">Building Name</label>
            <input
              type="text"
              name="buildingName"
              placeholder="Enter building name"
              value={formData.buildingName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none"
            />
          </div>

            {/* Address */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter building address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#4B164C] outline-none"
            />
          </div>

            {/* City */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none"
            />
          </div>

            {/* Area */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">Area</label>
            <input
              type="text"
              name="area"
              placeholder="Enter area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none"
            />
          </div>

            {/* Contact Numbers */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Numbers</label>
            {formData.contactNumbers.map((num, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Enter contact number"
                  value={num}
                  onChange={(e) => handleContactChange(index, e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {formData.contactNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Contact
            </button>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="latitude"
                placeholder="Enter latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="longitude"
                placeholder="Enter longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

            {/* Active Status Switch */}
            <div className="flex items-center gap-3">
              <label className="font-medium text-gray-700 dark:text-gray-300">Status</label>
              <Switch checked={formData.isActive} onChange={handleToggleActive} />
              <span className="text-gray-700 dark:text-gray-300">{formData.isActive ? "Active" : "Inactive"}</span>
            </div>

          {/* Building Details */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Building Details</label>
            <textarea
              name="buildingDetails"
              placeholder="Enter building details"
              value={formData.buildingDetails}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#5DB7AE] outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Images</label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                handleImageChange(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-[#5DB7AE] transition"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              <p className="text-gray-500">Drag & drop images here, or click to select</p>
            </div>

            <input
              type="file"
              id="imageInput"
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files)}
              className="hidden"
            />

            {formData.images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt={`preview-${i}`} className="w-24 h-24 rounded-lg object-cover border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] hover:from-[#3a7d74] hover:to-[#5DB7AE] text-white rounded-lg transition">
              Save Building
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBuildingModal;
