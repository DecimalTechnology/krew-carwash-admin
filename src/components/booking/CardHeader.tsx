import React from "react";

interface CardHeaderProps {
    title: string;
    icon?: React.ElementType;
    action?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, icon: Icon, action }) => (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="p-2 bg-[#5DB7AE]/10 text-[#5DB7AE] rounded-lg">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {action}
    </div>
);

export default CardHeader;