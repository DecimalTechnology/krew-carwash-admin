import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Calendar, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthlySales } from "../../api/admin/dashboardService";

interface MonthlySalesData {
    month: string;
    sales: number;
    bookings: number;
}

interface MonthlySalesChartProps {
    selectedYear?: number;
    fromDate?: string;
    toDate?: string;
    filter?: string;
}

function MonthlySalesChart({ selectedYear: initialYear = new Date().getFullYear(), fromDate, toDate, filter }: MonthlySalesChartProps) {
    const [chartData, setChartData] = useState<MonthlySalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalSales, setTotalSales] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [selectedMetric, setSelectedMetric] = useState<"sales" | "bookings">("sales");
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [growthPercentage, setGrowthPercentage] = useState(0);
    const [peakMonth, setPeakMonth] = useState<{ name: string; sales: number; bookings: number } | null>(null);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format for chart tooltip
    const formatTooltip = (value: number, name: string) => {
        if (name === "sales") {
            return [formatCurrency(value), "Sales"];
        }
        return [value.toLocaleString(), "Bookings"];
    };

    // Get bar color based on value
    const getBarColor = (value: number, metric: "sales" | "bookings") => {
        const maxValue = Math.max(...chartData.map((d) => d[metric]));
        const ratio = value / maxValue;

        if (metric === "sales") {
            // Gradient from blue to green based on value
            if (ratio > 0.8) return "#10B981"; // Emerald
            if (ratio > 0.6) return "#059669"; // Emerald darker
            if (ratio > 0.4) return "#3B82F6"; // Blue
            if (ratio > 0.2) return "#2563EB"; // Blue darker
            return "#1D4ED8"; // Blue darkest
        } else {
            // Gradient from purple to pink for bookings
            if (ratio > 0.8) return "#8B5CF6"; // Violet
            if (ratio > 0.6) return "#7C3AED"; // Violet darker
            if (ratio > 0.4) return "#EC4899"; // Pink
            if (ratio > 0.2) return "#DB2777"; // Pink darker
            return "#BE185D"; // Pink darkest
        }
    };

    // Handle data export
    const handleExportData = () => {
        const csvContent = [["Month", "Sales ($)", "Bookings"].join(","), ...chartData.map((row) => [row.month, row.sales, row.bookings].join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `monthly-sales-${selectedYear}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle year change
    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Call the API with selected year
                const res = await getMonthlySales(selectedYear);
               
                
                if (res.success) {
                    setChartData(res.data.chartData);
                    setTotalSales(res.data.totals.totalSales);
                    setTotalBookings(res.data.totals.totalBookings);
                    setGrowthPercentage(res.data.growthPercentage || 0);
                    setPeakMonth(res.data.peakMonth || null);
                } else {
                    throw new Error(res.message || "Failed to fetch data");
                }
            } catch (error: any) {
                console.error("Error fetching monthly sales data:", error);
                setError(error.message || "Failed to load monthly sales data");
                
                // Fallback to empty data
                setChartData([]);
                setTotalSales(0);
                setTotalBookings(0);
                setGrowthPercentage(0);
                setPeakMonth(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear]); // Only depend on selectedYear

    // Loading skeleton
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to Load Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Calculate average order value
    const avgOrderValue = totalBookings > 0 ? totalSales / totalBookings : 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Monthly Sales Overview
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Showing sales and booking trends for {selectedYear}</p>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setSelectedMetric("sales")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                selectedMetric === "sales"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            Sales
                        </button>
                        <button
                            onClick={() => setSelectedMetric("bookings")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                selectedMetric === "bookings"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            Bookings
                        </button>
                    </div>

                    <button
                        onClick={handleExportData}
                        disabled={chartData.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            chartData.length === 0
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total {selectedYear} Sales</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalSales)}</p>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <span className={`font-medium ${growthPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {growthPercentage >= 0 ? "↑" : "↓"} {Math.abs(growthPercentage).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total {selectedYear} Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalBookings?.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Average: {Math.round(totalBookings / 12)} per month</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Order Value</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(avgOrderValue)}</p>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <span className="text-2xl font-bold text-purple-500">$</span>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Per booking average</div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-72">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                            <XAxis 
                                dataKey="month" 
                                stroke="#9CA3AF" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={{ stroke: "#374151", opacity: 0.2 }} 
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: "#374151", opacity: 0.2 }}
                                tickFormatter={(value) => 
                                    selectedMetric === "sales" 
                                        ? `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString()}` 
                                        : value.toLocaleString()
                                }
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelFormatter={(label) => `Month: ${label}`}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "0.5rem",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey={selectedMetric} 
                                name={selectedMetric === "sales" ? "Sales ($)" : "Bookings"} 
                                radius={[4, 4, 0, 0]}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={getBarColor(entry[selectedMetric], selectedMetric)} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No sales data available for {selectedYear}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Year Selector and Peak Month Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center justify-between md:justify-start space-x-2">
                        <button
                            onClick={() => handleYearChange(selectedYear - 1)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Previous year"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                                <button
                                    key={year}
                                    onClick={() => handleYearChange(year)}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors font-medium ${
                                        year === selectedYear 
                                            ? "bg-blue-500 text-white" 
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => handleYearChange(selectedYear + 1)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Next year"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                    
                    {peakMonth && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Peak month: <span className="font-medium text-gray-900 dark:text-white">{peakMonth.name}</span> 
                            ({formatCurrency(peakMonth.sales)} from {peakMonth.bookings} bookings)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MonthlySalesChart;