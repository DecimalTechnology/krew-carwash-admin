import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Package, MoreVertical, LayoutDashboard, Users, FileText, Loader2, AlertCircle } from "lucide-react";
import { getBooking } from "../../api/admin/bookingServie";
import { BookingData } from "../../interface/IBooking";
import OverviewTab from "../../components/booking/OverviewTab";
import ServicesTab from "../../components/booking/ServiceTab";
import CustomerTab from "../../components/booking/CustomerTab";
import TeamTab from "../../components/booking/TeamTab";
import PaymentTab from "../../components/booking/PaymentTab";
import { getStatusStyles } from "../../components/booking/FormDate";

// Tab definitions
const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "services", label: "Services & Sessions", icon: Package },
    { id: "customer", label: "Customer & Vehicle", icon: Users },
    { id: "team", label: "Team", icon: Users },
    { id: "payment", label: "Payment", icon: FileText },
] as const;

const BookingDetails = () => {
    const params = useParams();
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "services" | "customer" | "team" | "payment">("overview");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const bookingId = params.id;
                const res = await getBooking(bookingId as string);

                if (res && res.success) {
                    setBooking(res.data);
                } else {
                    setError(res?.message || "Failed to fetch booking details");
                }
            } catch (err) {
                console.error(err);
                setError("An unexpected error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (loading) {
        // return <LoadingSkeleton />;
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Booking</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error || "Booking information unavailable"}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12 font-sans text-gray-900 dark:text-white">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-6 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5DB7AE] to-[#4a9d91] text-white flex items-center justify-center shadow-lg shadow-[#5DB7AE]/20 shrink-0">
                                    <Package className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{booking.package?.packageId?.name}</h1>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">#{booking.bookingId}</span>
                                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                        <span>{booking.bookingType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex items-center gap-3">
                                <button className="hidden sm:flex px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm shadow-sm">
                                    Contact Support
                                </button>
                                <button className="px-5 py-2.5 bg-[#5DB7AE] text-white font-medium rounded-xl hover:bg-[#4a9d91] transition-colors text-sm shadow-lg shadow-[#5DB7AE]/30">
                                    Edit Booking
                                </button>
                            </div> */}
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`
                                            flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                                            ${isActive ? "border-[#5DB7AE] text-[#5DB7AE]" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#5DB7AE] hover:border-[#5DB7AE]/50"}
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? "text-[#5DB7AE]" : "text-gray-400"}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "overview" && <OverviewTab booking={booking} />}
                {activeTab === "services" && <ServicesTab booking={booking} />}
                {activeTab === "customer" && <CustomerTab booking={booking} />}
                {activeTab === "team" && <TeamTab booking={booking} />}
                {activeTab === "payment" && <PaymentTab booking={booking} />}
            </main>
        </div>
    );
};

export default BookingDetails;
