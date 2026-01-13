import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRecentBookings } from "../../api/admin/dashboardService";
import { CheckCircle, Clock, XCircle, CircleDollarSign, User } from "lucide-react";
import TopCleaners from "./TopCleaners";

function RecentBookings({ fromDate, toDate, filter }: any) {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getRecentBookings(fromDate, toDate, filter);
               
                const formattedBookings =
                    res?.data?.map((booking: any) => ({
                        bookingId: booking.bookingId,
                        user: booking.user || null,
                        totalPrice: booking.totalPrice,
                        paymentStatus: booking.paymentStatus || null,
                        _id:booking?._id
                    })) || [];
                setBookings(formattedBookings);
            } catch (error) {
                console.error("Error fetching recent bookings:", error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fromDate, toDate, filter]);

    // Function to get status badge color and icon for payment status
    const getPaymentStatusInfo = (status: string) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return {
                    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    icon: <CheckCircle className="w-3 h-3 mr-1" />,
                    label: "Paid",
                };
            case "PENDING":
                return {
                    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                    icon: <Clock className="w-3 h-3 mr-1" />,
                    label: "Pending",
                };
            case "FAILED":
                return {
                    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    icon: <XCircle className="w-3 h-3 mr-1" />,
                    label: "Failed",
                };
            case "CANCELLED":
                return {
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                    icon: <XCircle className="w-3 h-3 mr-1" />,
                    label: "Cancelled",
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                    icon: <Clock className="w-3 h-3 mr-1" />,
                    label: status || "Unknown",
                };
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `AED ${amount?.toFixed(2) || "0.00"}`;
    };

    // Show only first 5 bookings for "recent"
    const recentBookings = bookings.slice(0, 5);

    // Loading skeleton
    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="p-6">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <TopCleaners />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings - Dynamic */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {bookings.length > 0 ? `Showing ${Math.min(recentBookings.length, 5)} of ${bookings.length} bookings` : "No booking activities"}
                            </p>
                        </div>
                        {bookings.length > 0 && (
                            <button onClick={() => navigate("/bookings")} className="text-sm text-[#5DB7AE] hover:text-[#4a9d91] font-medium">
                                View All
                            </button>
                        )}
                    </div>
                </div>
                
                {recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className=" dark:divide-gray-800">
                                {recentBookings.map((booking, index) => {
                                    const paymentStatus = getPaymentStatusInfo(booking.paymentStatus);

                                    return (
                                        <tr
                                            key={booking.bookingId || index}
                                            onClick={() => navigate(`/bookings/${booking._id}`)}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer"
                                        >
                                            {/* Booking ID Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.bookingId || `Booking ${index + 1}`}</span>
                                                </div>
                                            </td>

                                            {/* Customer Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.user || "Guest User"}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                                                        {paymentStatus.icon}
                                                        {paymentStatus.label}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Amount Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(booking.totalPrice)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <CircleDollarSign className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Bookings Found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No booking data available for the selected period.</p>
                    </div>
                )}
            </div>

            {/* Top Cleaners - Static */}
            <TopCleaners />
        </div>
    );
}

export default RecentBookings;