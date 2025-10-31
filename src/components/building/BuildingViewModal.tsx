import React from "react";
import { IBuilding } from "../../interface/IBuilding";
import { X, Building2, Phone, MapPin, CheckCircle2, XCircle, Calendar, Package as PackageIcon } from "lucide-react";

interface IProps {
  building: IBuilding;
  onClose: () => void;
}

const BuildingViewModal: React.FC<IProps> = ({ building, onClose }) => {
  if (!building) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
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
            <h2 className="text-2xl font-bold text-white">Building Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Name and Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Building Name
                </h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{building.buildingName}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                building.isActive 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}>
                {building.isActive ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </span>
            </div>

            {/* Location Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* City */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    City
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {building.city}
                  </p>
                </div>
              </div>

              {/* Area */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Area
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {building.area}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            {building.address && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Address
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {building.address}
                </p>
              </div>
            )}

            {/* Contact Numbers */}
            {building.contactNumbers && building.contactNumbers.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact Numbers
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {building.contactNumbers.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Packages */}
            {building.packages && building.packages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PackageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assigned Packages ({building.packages.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {building.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-brand-500 dark:bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {typeof pkg.packageId === 'object' && pkg.packageId?.name 
                            ? pkg.packageId.name 
                            : `Package ID: ${pkg.packageId}`}
                        </p>
                      </div>
                      {pkg.prices && pkg.prices.length > 0 && (
                        <div className="mt-2 pl-10 space-y-1">
                          {pkg.prices.map((price, priceIndex) => (
                            <div key={priceIndex} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {typeof price.vehicleType === 'object' && price.vehicleType?.name 
                                  ? price.vehicleType.name 
                                  : typeof price.vehicleType === 'string'
                                  ? `Vehicle ID: ${price.vehicleType}`
                                  : "Unknown Vehicle"}
                              </span>
                              <span className="font-semibold text-brand-600 dark:text-brand-400">
                                AED {price.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created At
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(building.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Updated At
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(building.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingViewModal;
