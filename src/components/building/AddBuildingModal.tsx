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
      <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-[#4B164C]">Add New Building</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Building Name */}
          <div>
            <label className="block font-medium text-gray-700">Building Name</label>
            <input
              type="text"
              name="buildingName"
              placeholder="Enter building name"
              value={formData.buildingName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#4B164C] outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium text-gray-700">Address</label>
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
            <label className="block font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#4B164C] outline-none"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block font-medium text-gray-700">Area</label>
            <input
              type="text"
              name="area"
              placeholder="Enter area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#4B164C] outline-none"
            />
          </div>

          {/* Contact Numbers */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Contact Numbers</label>
            {formData.contactNumbers.map((num, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Enter contact number"
                  value={num}
                  onChange={(e) => handleContactChange(index, e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#4B164C] outline-none"
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

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Status</label>
            <Switch checked={formData.isActive} onChange={handleToggleActive} />
            <span className="text-gray-700">{formData.isActive ? "Active" : "Inactive"}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#4B164C] hover:bg-[#5e1b60] text-white rounded-lg transition"
            >
              Save Building
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBuildingModal;
