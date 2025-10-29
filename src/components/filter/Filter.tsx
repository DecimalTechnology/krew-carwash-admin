"use client";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
    filter: {
        status: string;
        search: string;
        sortedBy: string;
        sortOrder: "asc" | "desc";
    };
    setFilter: React.Dispatch<
        React.SetStateAction<{
            status: string;
            search: string;
            sortedBy: string;
            sortOrder: "asc" | "desc";
        }>
    >;
    statusValues: string[];
    sortOptions: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, statusValues, sortOptions }) => {
    const [isSortOpen, setIsSortOpen] = useState(false);

    const toggleSortOrder = () => {
        setFilter((prev) => ({
            ...prev,
            sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            {/* Status Tabs */}
            <div className="flex items-center gap-2">
                {statusValues.map((status) => (
                    <button
                        key={status}
                        onClick={() =>
                            setFilter((prev) => ({
                                ...prev,
                                status: status.toLowerCase(),
                            }))
                        }
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 
              ${filter.status === status.toLowerCase() ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={filter.search}
                        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
                        placeholder="Search..."
                        className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DB7AE] focus:outline-none"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
                    >
                        {filter.sortedBy ? filter.sortedBy.charAt(0).toUpperCase() + filter.sortedBy.slice(1) : "Sort By"}{" "}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                            {sortOptions.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        setFilter((prev) => ({
                                            ...prev,
                                            sortedBy: option.toLowerCase(),
                                        }));
                                        setIsSortOpen(false);
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                        option.toLowerCase() === filter.sortedBy ? "text-[#5DB7AE] font-medium" : "text-gray-700"
                                    }`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort Order Toggle */}
                <button onClick={toggleSortOrder} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <ArrowUpDown className={`w-4 h-4 transition-transform ${filter.sortOrder === "asc" ? "rotate-180" : ""}`} />
                </button>
            </div>
        </div>
    );
};
