import React from "react";

interface DetailRowProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value, isLast }) => (
    <div className={`flex items-start gap-4 py-4 ${!isLast ? "border-b border-gray-50 dark:border-gray-700" : ""}`}>
        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{value || "N/A"}</div>
        </div>
    </div>
);

export default DetailRow;