import React from "react";
import { IPackage } from "../../interface/IPackage";
import Badge from "../ui/badge/Badge";

interface IProps {
  package: IPackage;
  onClose: () => void;
}

const ViewPackageModal: React.FC<IProps> = ({ package: pkg, onClose }) => {
  if (!pkg) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#5DB7AE] dark:text-[#6ECFC3]">
          Package Details
        </h2>

        <div className="space-y-5">
          {/* Name & Status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Package Name</h3>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{pkg.name}</p>
            </div>
            <Badge color={pkg.isActive ? "success" : "error"} variant="light" size="md">
              {pkg.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Frequency */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Frequency</h3>
            <p className="text-gray-800 dark:text-white mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5DB7AE]/10 dark:bg-[#5DB7AE]/20 text-[#5DB7AE] dark:text-[#6ECFC3] font-medium">
                {pkg.frequency}
              </span>
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Description</h3>
            <p className="text-gray-800 dark:text-white mt-1 whitespace-pre-line">
              {pkg.description || "-"}
            </p>
          </div>

          {/* Base Prices */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Pricing by Vehicle Type</h3>
            <div className="space-y-2">
              {pkg.basePrices && pkg.basePrices.length > 0 ? (
                pkg.basePrices.map((bp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {bp.vehicleType?.name || "Unknown Vehicle"}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-[#5DB7AE] dark:text-[#6ECFC3]">
                      AED {bp.price.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pricing information available</p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex gap-6 pt-4 border-t dark:border-gray-700">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm">Created At</h3>
              <p className="text-gray-800 dark:text-white text-sm mt-1">
                {new Date(pkg.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm">Updated At</h3>
              <p className="text-gray-800 dark:text-white text-sm mt-1">
                {new Date(pkg.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
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

export default ViewPackageModal;

