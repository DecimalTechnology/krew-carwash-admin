import { useEffect, useState } from "react";
import { getOverview } from "../../api/admin/dashboardService";

interface MainCardsProps {
    filter: string;
    fromDate: string;
    toDate: string;
}

interface OverviewData {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    failedBookings: number;
    totalCleaners: number;
    totalCustomers: number;
    totalBuildings: number;
    totalSales: number;
    totalPackages: number;
}

function MainCards({ filter, fromDate, toDate }: any) {
    const [data, setData] = useState<OverviewData>({
        totalBookings: 0,
        completedBookings: 0,
        totalSales: 0,
        totalCustomers: 0,
        pendingBookings: 0,
        failedBookings: 0,
        totalPackages: 0,
        totalBuildings: 0,
        totalCleaners: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getOverview(fromDate, toDate, filter);

                if (!res?.data) {
                    throw new Error("No data received from server");
                }

                const overviewData = {
                    totalBookings: res.data.totalBookings || 0,
                    completedBookings: res.data.completedBookings || 0,
                    pendingBookings: res.data.pendingBookings || 0,
                    failedBookings: res.data.failedBookings || 0,
                    totalCleaners: res.data.totalCleaners || 0,
                    totalCustomers: res.data.totalCustomers || 0,
                    totalBuildings: res.data.totalBuildings || 0,
                    totalSales: res.data.totalSales || 0,
                    totalPackages: res.data.totalPackages || 0,
                };

                setData(overviewData);
            } catch (err: any) {
                console.error("Error fetching overview data:", err);
                setError(err.message || "Failed to load dashboard data");

                // Reset data on error
                setData({
                    totalBookings: 0,
                    completedBookings: 0,
                    totalSales: 0,
                    totalCustomers: 0,
                    pendingBookings: 0,
                    failedBookings: 0,
                    totalPackages: 0,
                    totalBuildings: 0,
                    totalCleaners: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter, fromDate, toDate]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: "AED",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Loading skeleton component
    const CardSkeleton = () => (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-full">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="p-3 bg-gray-300 dark:bg-gray-700 rounded-xl">
                    <div className="w-8 h-8"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Data</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Total Bookings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalBookings.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Card 2: Total Sales */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Sales</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(data.totalSales)}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <svg className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Card 3: Total Customers */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Customers</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalCustomers.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <svg className="w-8 h-8 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Card 4: Completed Bookings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed Bookings</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.completedBookings.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Additional row of 4 cards */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {/* Card 5: Pending Bookings */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Bookings</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.pendingBookings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-xl">
                            <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Card 6: Package Services */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Package Services</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalPackages.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Card 7: Building Services */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Building Services</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalBuildings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <svg className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Card 8: Cleaner Services */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cleaner Services</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.totalCleaners.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/20 rounded-xl">
                            <svg className="w-8 h-8 text-cyan-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h11M9 21V3m0 18l-6-6h6m6 0l-6 6h6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainCards;
