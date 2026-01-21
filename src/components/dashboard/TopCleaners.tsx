import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getTopCleaners } from "../../api/admin/dashboardService";

function TopCleaners() {
    const navigate = useNavigate();
    const [cleaners, setCleaners] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getTopCleaners();
            setCleaners(res?.data || []);
        };
        fetchData();
    }, []);


 

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Cleaners
                </h2>
               
            </div>

            <div className="p-6 space-y-4">
                {cleaners.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No data available
                    </p>
                )}

                {cleaners.map((cleaner, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(`/cleaners/${cleaner?._id}`)}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        {/* Rank */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold
                            ${
                                index < 3
                                    ? "bg-[#5DB7AE] text-white"
                                    : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            {index + 1}
                        </div>

                        {/* Cleaner Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {cleaner.name}
                            </h4>

                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {cleaner.totalTasksCompleted} jobs
                                </span>

                                {/* Static rating (optional) */}
                             
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopCleaners;
