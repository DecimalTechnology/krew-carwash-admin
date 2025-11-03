"use client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createBuilding } from "../../api/admin/buildingService";
import Switch from "../../components/ui/switch/Switch";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import PackageSelector from "../../components/building/PackageSelector";

function AddBuildingPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        buildingName: "",
        address: "",
        city: "",
        area: "",
        isActive: true,
        contactNumbers: [""],
        packages: [],
    });

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
        setFormData((prev) => ({
            ...prev,
            contactNumbers: [...prev.contactNumbers, ""],
        }));
    };

    const removeContact = (index: number) => {
        const newContacts = formData.contactNumbers.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, contactNumbers: newContacts }));
    };

    const handleSubmit = async () => {


        const payload = {
            buildingName: formData.buildingName.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            area: formData.area.trim(),
            isActive: formData.isActive,
            contactNumbers: formData.contactNumbers.filter((num) => num.trim() !== ""),
            packages: formData?.packages,
        };

        const res = await createBuilding(payload);
        if (res?.success) {
            navigate("/building");
        }
    };

   
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <Breadcrumb
                    pageName="Add Building"
                    elements={[
                        { page: "Home", path: "/" },
                        { page: "Buildings", path: "/building" },
                        { page: "Add Building", path: "" },
                    ]}
                />

                {/* Form Section */}
                <div className="bg-white shadow-lg rounded-2xl mt-8">
                    <form className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Building Name */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-800 mb-2">
                                        Building Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="buildingName"
                                        placeholder="Enter building name"
                                        value={formData.buildingName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-800 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter building address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>

                                {/* City & Area */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-2">
                                            Area <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            placeholder="Enter area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            required
                                            className="w-full border rounded-lg p-3 text-base focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Contact Numbers */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-800 mb-2">Contact Numbers</label>
                                    <div className="space-y-3">
                                        {formData.contactNumbers.map((num, index) => (
                                            <div key={index} className="flex gap-3 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Enter contact number"
                                                    value={num}
                                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                                    className="flex-1 border rounded-lg p-3 text-base focus:ring-2 focus:ring-[#4B164C] outline-none"
                                                />
                                                {formData.contactNumbers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeContact(index)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addContact}
                                        className="mt-3 px-5 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 text-sm font-medium"
                                    >
                                        + Add Contact
                                    </button>
                                </div>

                                {/* Active Status */}
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="block text-base font-semibold text-gray-800 mb-1">Building Status</label>
                                            <p className="text-sm text-gray-500">Set the building as active or inactive</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Switch checked={formData.isActive} onChange={handleToggleActive} />
                                            <span className={`text-base font-semibold ${formData.isActive ? "text-green-600" : "text-red-600"}`}>
                                                {formData.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                    </form>
                    <PackageSelector handleSubmit={handleSubmit} setFormData={setFormData} />
                  
                </div>
            </div>
        </div>
    );
}

export default AddBuildingPage;
