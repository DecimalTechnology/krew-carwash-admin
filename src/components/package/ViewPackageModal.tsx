import React from "react";
import { IPackage } from "../../interface/IPackage";
import { X, Package as PackageIcon, Calendar, DollarSign, CheckCircle2, XCircle, Repeat, Car } from "lucide-react";

interface IProps {
  package: IPackage;
  onClose: () => void;
}

const ViewPackageModal: React.FC<IProps> = ({ package: pkg, onClose }) => {
  if (!pkg) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-brand-500 dark:bg-brand-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Package Details</h2>
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
                  Package Name
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                pkg.isActive 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}>
                {pkg.isActive ? (
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

            {/* Frequency */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Repeat className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Frequency
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {pkg.frequency}
                </p>
              </div>
            </div>

            {/* Description */}
            {pkg.description && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            )}

            {/* Base Prices */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pricing by Vehicle Type
                </h3>
              </div>
              <div className="space-y-2">
                {pkg.basePrices && pkg.basePrices.length > 0 ? (
                  pkg.basePrices.map((bp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-500 dark:bg-brand-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle Type</p>
                          <p className="text-base font-semibold text-gray-800 dark:text-white">
                            {bp.vehicleType?.name || "Unknown Vehicle"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</p>
                        <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                          AED {bp.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Car className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No pricing information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created At
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(pkg.createdAt).toLocaleDateString('en-US', { 
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
                    {new Date(pkg.updatedAt).toLocaleDateString('en-US', { 
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

export default ViewPackageModal;
