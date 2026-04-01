import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import ExportParent from "../dashboard/ExportParent";

function ExportAndFilter({ packageId, buildingId, cleanerId }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [toDate, setToDate] = useState<any>();
    const [fromDate, setFromDate] = useState<any>();

    // Reset filter when dates are selected
    useEffect(() => {
        if (fromDate || toDate) {
            setFilter("");
        }
    }, [fromDate, toDate]);

    // Reset dates when filter is selected
    useEffect(() => {
        if (filter) {
            setFromDate(null);
            setToDate(null);
        }
    }, [filter]);

    // Determine if date pickers should be shown
    const showDatePickers = !filter;

    const handleApplyFilters = () => {
        // Handle the export with current filters
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilter("");
        setFromDate(null);
        setToDate(null);
    };

    return (
        <>
            {/* Export Button that opens modal */}
            <div className="relative">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A9D91] hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export</span>
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
                        onClick={handleCloseModal}
                    />

                    {/* Modal Content */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Export Options
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Filter Controls */}
                            <div className="space-y-4">
                                {/* Filter Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quick Filter
                                    </label>
                                    <select 
                                        value={filter} 
                                        onChange={(e) => setFilter(e.target.value)} 
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                                    >
                                        <option value="">All</option>
                                        <option value="today">Today</option>
                                        <option value="thisWeek">This Week</option>
                                        <option value="thisMonth">This Month</option>
                                        <option value="lastSevenDays">Last 7 Days</option>
                                        <option value="lastMonth">Last Month</option>
                                        <option value="thisYear">This Year</option>
                                        <option value="lastYear">Last Year</option>
                                    </select>
                                </div>

                                {/* OR Divider */}
                                {showDatePickers && (
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                                OR
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Date Pickers */}
                                {showDatePickers && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Custom Date Range
                                        </label>
                                        <div className="space-y-3">
                                            {/* From Date Picker */}
                                            <div>
                                                <DatePicker
                                                    selected={fromDate}
                                                    onChange={(date: Date | null) => setFromDate(date)}
                                                    selectsStart
                                                    startDate={fromDate}
                                                    endDate={toDate}
                                                    customInput={<CustomDateInput placeholder="From Date" />}
                                                    dateFormat="MMM d, yyyy"
                                                    className="w-full"
                                                    wrapperClassName="w-full"
                                                    popperClassName="react-datepicker-popper"
                                                    popperPlacement="bottom-end"
                                                    isClearable={true}
                                                />
                                            </div>

                                            {/* To Date Picker */}
                                            <div>
                                                <DatePicker
                                                    selected={toDate}
                                                    onChange={(date: Date | null) => setToDate(date)}
                                                    selectsEnd
                                                    startDate={fromDate}
                                                    endDate={toDate}
                                                    minDate={fromDate}
                                                    customInput={<CustomDateInput placeholder="To Date" disabled={!fromDate} />}
                                                    dateFormat="MMM d, yyyy"
                                                    className="w-full"
                                                    wrapperClassName="w-full"
                                                    popperClassName="react-datepicker-popper"
                                                    popperPlacement="bottom-end"
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <ExportParent 
                                    filter={filter} 
                                    fromDate={fromDate} 
                                    toDate={toDate} 
                                    packageId={packageId} 
                                    buildingId={buildingId} 
                                    cleanerId={cleanerId} 
                                    onExportComplete={() => setIsModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ExportAndFilter;

const CustomDateInput = ({ value, onClick, disabled, placeholder }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
            flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition w-full
            ${
                disabled
                    ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }
        `}
    >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="truncate">{value || placeholder}</span>
    </button>
);