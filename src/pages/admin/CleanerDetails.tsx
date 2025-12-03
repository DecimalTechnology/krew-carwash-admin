/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    ClipboardList,
    TrendingUp,
    Briefcase,
    ArrowLeft,
    Badge,
} from "lucide-react";
import { getCleanerDetails } from "../../api/admin/cleanerService";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

// --- Types ---
interface Cleaner {
    _id: string;
    cleanerId: string;
    name: string;
    phone: string;
    email?: string;
    image?: string;
    status: "Available" | "On Task" | "On Leave";
    totalTasksCompleted: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Booking {
    _id: string;
    bookingId: string;
    userId: {
        name: string;
        email: string;
        phone: string;
        image?: string;
        apartmentNumber?: string;
    };
    vehicleId: {
        vehicleModel: string;
        vehicleNumber: string;
        color: string;
        parkingArea: string;
        parkingNumber: string;
    };
    buildingId: {
        buildingName: string;
        address: string;
        area: string;
        city: string;
    };
    package: {
        packageId: {
            name: string;
            description: string;
            frequency: string;
        };
        totalSessions: number;
        sessions: any[];
        price: number;
    };
    addons: any[];
    bookingType: string;
    totalPrice: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

interface CleanerDetailsData {
    cleaner: Cleaner;
    statistics: {
        totalTasksAssigned: number;
        totalTasksCompleted: number;
        tasksInProgress: number;
        totalSessionsCompleted: number;
    };
    completedBookings: Booking[];
    inProgressBookings: Booking[];
    pendingBookings: Booking[];
}

// --- Utility Functions ---
const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "AVAILABLE":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
        case "ON TASK":
            return "bg-blue-50 text-blue-700 ring-blue-600/20";
        case "ON LEAVE":
            return "bg-amber-50 text-amber-700 ring-amber-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
};

const getBookingStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "ASSIGNED":
            return "bg-blue-50 text-blue-700 ring-blue-600/20";
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
        case "PENDING":
            return "bg-amber-50 text-amber-700 ring-amber-600/20";
        case "IN PROGRESS":
            return "bg-purple-50 text-purple-700 ring-purple-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
};

// --- Sub-Components ---
const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className={`p-3 ${color} rounded-xl`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const BookingsTable: React.FC<{ bookings: Booking[]; navigate: any; emptyMessage: string; emptyIcon: React.ElementType }> = ({ 
    bookings, 
    navigate, 
    emptyMessage,
    emptyIcon: EmptyIcon 
}) => {
    if (bookings.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <EmptyIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{emptyMessage}</h3>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                No
                            </TableCell>
                            <TableCell className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Booking ID
                            </TableCell>
                            <TableCell className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Package
                            </TableCell>
                            <TableCell className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Customer
                            </TableCell>
                            <TableCell className="px-2 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Vehicle
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Building
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Start Date
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Status
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {bookings.map((booking, index) => (
                            <TableRow key={booking._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-mono">
                                    {booking.bookingId}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                    <div>
                                        <div className="font-medium">{booking.package?.packageId?.name || "N/A"}</div>
                                        <div className="text-xs text-gray-500">{booking.bookingType}</div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                    <div>
                                        <div className="font-medium">{booking.userId?.name || "N/A"}</div>
                                        <div className="text-xs text-gray-500">{booking.userId?.phone || "N/A"}</div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-white/90">
                                            {booking.vehicleId?.vehicleModel || "N/A"}
                                        </div>
                                        <div className="text-xs">{booking.vehicleId?.vehicleNumber || "N/A"}</div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-white/90">
                                            {booking.buildingId?.buildingName || "N/A"}
                                        </div>
                                        <div className="text-xs">
                                            {booking.buildingId?.area && booking.buildingId?.city 
                                                ? `${booking.buildingId.area}, ${booking.buildingId.city}`
                                                : "N/A"}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {formatDate(booking.startDate)}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-start">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${getBookingStatusStyles(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </TableCell>

                                <TableCell className="px-4 py-3">
                                    <button
                                        onClick={() => navigate(`/bookings/${booking._id}`)}
                                        className="px-3 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium"
                                    >
                                        View
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center animate-pulse">
            <div className="w-14 h-14 bg-gray-200 rounded-full mr-4"></div>
            <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
        </div>
    </div>
);

// --- Main Component ---
const CleanerDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CleanerDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "completed" | "in-progress" | "pending">("profile");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const cleanerId = params.id;
                if (!cleanerId) {
                    setError("Cleaner ID is required");
                    return;
                }

                const res = await getCleanerDetails(cleanerId);

                if (res && res.success) {
                    setData(res.data);
                } else {
                    setError(res?.message || "Failed to fetch cleaner details");
                }
            } catch (err: any) {
                console.error(err);
                setError(err?.message || "An unexpected error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Cleaner Details</h2>
                    <p className="text-gray-600">{error || "Cleaner information unavailable"}</p>
                    <button
                        onClick={() => navigate("/cleaners")}
                        className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back to Cleaners
                    </button>
                </div>
            </div>
        );
    }

    const { cleaner, statistics, completedBookings, inProgressBookings, pendingBookings } = data;

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "completed", label: `Completed Tasks (${statistics.totalTasksCompleted})`, icon: CheckCircle },
        { id: "in-progress", label: `In Progress (${statistics.tasksInProgress})`, icon: Clock },
        { id: "pending", label: `Pending (${pendingBookings.length})`, icon: ClipboardList },
    ] as const;

    // --- Tab Content Renderers ---
    const renderProfile = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Personal Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#5DB7AE]" />
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Cleaner ID</label>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 font-mono bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">{cleaner.cleanerId}</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</label>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{cleaner.name}</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone Number</label>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {cleaner.phone}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</label>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {cleaner.email || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Join Date</label>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            {formatDate(cleaner.createdAt)}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Account Status</label>
                        <div className="mt-1">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${cleaner.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
                                {cleaner.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#5DB7AE]" />
                    Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 uppercase">Total Sessions Completed</p>
                                <p className="text-3xl font-bold text-emerald-700 mt-1">{statistics.totalSessionsCompleted}</p>
                            </div>
                            <Badge className="w-10 h-10 text-emerald-600" />
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase">Completion Rate</p>
                                <p className="text-3xl font-bold text-blue-700 mt-1">
                                    {statistics.totalTasksAssigned > 0 
                                        ? Math.round((statistics.totalTasksCompleted / statistics.totalTasksAssigned) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCompletedTasks = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <BookingsTable 
                bookings={completedBookings} 
                navigate={navigate}
                emptyMessage="No Completed Tasks"
                emptyIcon={CheckCircle}
            />
        </div>
    );

    const renderInProgressTasks = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <BookingsTable 
                bookings={inProgressBookings} 
                navigate={navigate}
                emptyMessage="No Tasks In Progress"
                emptyIcon={Clock}
            />
        </div>
    );

    const renderPendingTasks = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <BookingsTable 
                bookings={pendingBookings} 
                navigate={navigate}
                emptyMessage="No Pending Tasks"
                emptyIcon={ClipboardList}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        pageName="Cleaner Details"
                        elements={[
                            { page: "Home", path: "/" },
                            { page: "Cleaners", path: "/cleaners" },
                            { page: cleaner.name, path: `/cleaners/${cleaner._id}` },
                        ]}
                    />
                </div>
            </div>

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-6 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => navigate("/cleaners")}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Back to Cleaners"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </button>
                                {cleaner.image ? (
                                    <img
                                        src={cleaner.image}
                                        alt={cleaner.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5DB7AE] to-[#4a9d91] text-white flex items-center justify-center shadow-lg text-xl font-bold">
                                        {cleaner.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{cleaner.name}</h1>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${getStatusStyles(cleaner.status)}`}>
                                            {cleaner.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{cleaner.cleanerId}</span>
                                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                        <span>Professional Cleaner</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2.5 bg-[#5DB7AE] dark:bg-[#5DB7AE] border border-[#5DB7AE] text-white font-medium rounded-xl hover:bg-[#4a9d91] dark:hover:bg-[#4a9d91] transition-colors text-sm shadow-sm">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard icon={Briefcase} label="Total Tasks" value={statistics.totalTasksAssigned} color="bg-[#5DB7AE]/10 text-[#5DB7AE]" />
                            <StatCard icon={CheckCircle} label="Completed" value={statistics.totalTasksCompleted} color="bg-emerald-50 text-emerald-600" />
                            <StatCard icon={Clock} label="In Progress" value={statistics.tasksInProgress} color="bg-[#5DB7AE]/10 text-[#5DB7AE]" />
                            <StatCard icon={Badge} label="Sessions Done" value={statistics.totalSessionsCompleted} color="bg-[#5DB7AE]/10 text-[#5DB7AE]" />
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
                                            ${isActive ? "border-[#5DB7AE] text-[#5DB7AE]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "profile" && renderProfile()}
                {activeTab === "completed" && renderCompletedTasks()}
                {activeTab === "in-progress" && renderInProgressTasks()}
                {activeTab === "pending" && renderPendingTasks()}
            </main>
        </div>
    );
};

export default CleanerDetails;

