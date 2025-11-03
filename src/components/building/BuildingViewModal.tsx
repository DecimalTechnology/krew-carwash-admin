import React from "react";
import { IBuilding } from "../../interface/IBuilding";

interface IProps {
  building: IBuilding;
  onClose: () => void;
}

const BuildingViewModal: React.FC<IProps> = ({ building, onClose }) => {
  if (!building) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#5DB7AE] dark:text-[#6ECFC3]">
          Building Details
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Name</h3>
            <p className="text-gray-800 dark:text-white">{building.name}</p>
          </div>

          {/* Email */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Email</h3>
            <p className="text-gray-800 dark:text-white">{building.email || "-"}</p>
          </div>

          {/* Contact Numbers */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Contact Numbers</h3>
            <p className="text-gray-800 dark:text-white">
              {building.contactNumbers.length > 0 ? building.contactNumbers.join(", ") : "-"}
            </p>
          </div>

          {/* Coordinates */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Coordinates</h3>
            <p className="text-gray-800 dark:text-white">
              {building.coordinates
                ? `${building.coordinates.latitude}, ${building.coordinates.longitude}`
                : "-"}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Status</h3>
            <p className={`font-medium ${building.isActive ? "text-green-600" : "text-red-600"}`}>
              {building.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Building Details */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Details</h3>
            <p className="text-gray-800 dark:text-white whitespace-pre-line">{building.buildingDetails || "-"}</p>
          </div>

          {/* Images */}
          {building.images.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Images</h3>
              <div className="flex gap-3 flex-wrap">
                {building.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`building-${idx}`}
                    className="w-24 h-24 rounded-lg object-cover border dark:border-gray-700"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Created / Updated */}
          <div className="flex gap-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Created At</h3>
              <p className="text-gray-800 dark:text-white">{new Date(building.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Updated At</h3>
              <p className="text-gray-800 dark:text-white">{new Date(building.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingViewModal;
