import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import ExportParent from "../dashboard/ExportParent";

function ExportAndFilter({ packageId, buildingId, cleanerId }: any) {
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

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Filter Dropdown */}
            <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className={`px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900 ${
                    fromDate || toDate ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!!fromDate || !!toDate}
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

            {/* Date Pickers using react-datepicker - only show when no filter is selected */}
            {showDatePickers && (
                <div className="flex items-center gap-2">
                    {/* From Date Picker */}
                    <div className="relative">
                        <DatePicker
                            selected={fromDate}
                            onChange={(date: Date | null) => setFromDate(date)}
                            selectsStart
                            startDate={fromDate}
                            endDate={toDate}
                            customInput={<CustomDateInput placeholder="From" />}
                            dateFormat="MMM d, yyyy"
                            className="react-datepicker-custom"
                            wrapperClassName="date-picker-wrapper"
                            popperClassName="react-datepicker-popper"
                            popperPlacement="bottom-end"
                            isClearable={true}
                        />
                    </div>

                    <span className="text-gray-400">to</span>

                    {/* To Date Picker */}
                    <div className="relative">
                        <DatePicker
                            selected={toDate}
                            onChange={(date: Date | null) => setToDate(date)}
                            selectsEnd
                            startDate={fromDate}
                            endDate={toDate}
                            minDate={fromDate}
                            customInput={<CustomDateInput placeholder="To" disabled={!fromDate} />}
                            dateFormat="MMM d, yyyy"
                            className="react-datepicker-custom"
                            wrapperClassName="date-picker-wrapper"
                            popperClassName="react-datepicker-popper"
                            popperPlacement="bottom-end"
                            isClearable={true}
                        />
                    </div>
                </div>
            )}

            {/* Export Button */}
            <ExportParent 
                filter={filter} 
                fromDate={fromDate} 
                toDate={toDate} 
                packageId={packageId} 
                buildingId={buildingId} 
                cleanerId={cleanerId} 
            />
        </div>
    );
}

export default ExportAndFilter;

const CustomDateInput = ({ value, onClick, disabled, placeholder }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
                flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition min-w-32
                ${
                    disabled
                        ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }
            `}
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="truncate">{value || placeholder}</span>
    </button>
);