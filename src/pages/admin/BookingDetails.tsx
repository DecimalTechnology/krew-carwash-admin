import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Calendar,
    MapPin,
    Car,
    Phone,
    Mail,
    CheckCircle,
    Clock,
    Circle,
    ShieldCheck,
    Package,
    Layers,
    MoreVertical,
    Camera,
    ChevronRight,
    User,
    CreditCard,
    Briefcase,
    LayoutDashboard,
    Users,
    FileText,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { Session, BookingData, AddonBooking } from "./types";
import { getBooking } from "../../api/admin/bookingServie";

// --- API Service Simulation ---
// In your real app, uncomment the import below and remove this mock function
// import { getBooking } from "../../api/admin/bookingServie";

// --- Utility Functions ---

const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "ASSIGNED":
            return "bg-[#5DB7AE]/10 text-[#5DB7AE] ring-[#5DB7AE]/20";
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
        case "PENDING":
            return "bg-amber-50 text-amber-700 ring-amber-600/20";
        case "CANCELLED":
            return "bg-red-50 text-red-700 ring-red-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
};

// --- Sub-Components ---

const CardHeader: React.FC<{ title: string; icon?: React.ElementType; action?: React.ReactNode }> = ({ title, icon: Icon, action }) => (
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

const DetailRow: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; isLast?: boolean }> = ({
    icon: Icon,
    label,
    value,
    isLast,
}) => (
    <div className={`flex items-start gap-4 py-4 ${!isLast ? "border-b border-gray-50 dark:border-gray-700" : ""}`}>
        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{value || "N/A"}</div>
        </div>
    </div>
);

const SessionCard: React.FC<{
    session: Session;
    index: number;
    total: number;
    type: "PACKAGE" | "ADDON";
}> = ({ session, index, total }) => {
    const isCompleted = session.isCompleted;

    return (
        <div
            className={`
      relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 group
      ${
          isCompleted
              ? "bg-white dark:bg-gray-800 border-emerald-100 dark:border-gray-700 shadow-sm hover:border-emerald-200"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#5DB7AE] hover:shadow-md"
      }
    `}
        >
            <div className="flex justify-between items-start mb-3">
                <span
                    className={`
          text-xs font-bold px-2.5 py-1 rounded-md border
          ${isCompleted ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/30" : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/10"}
        `}
                >
                    Session {index + 1}
                </span>
                {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-transparent" /> : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
            </div>

            <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Calendar className={`w-4 h-4 ${isCompleted ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`} />
                    {formatDate(session.date)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-6">{session.completedBy ? "Completed" : "Scheduled"}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                {isCompleted ? (
                    <button className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        Photos
                    </button>
                ) : (
                    <button className="flex-1 text-xs bg-white border border-gray-200 text-gray-600 hover:text-[#5DB7AE] hover:border-[#5DB7AE] py-2 rounded-lg font-medium transition-colors">
                        Reschedule
                    </button>
                )}
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center animate-pulse">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl mr-4"></div>
            <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
        </div>
        <div className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
    </div>
);

// --- Main Component ---

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
                // In real app, use params.id. For demo, we ignore it to always show mock data
                const bookingId = params.id;
                const res = await getBooking(bookingId);

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
        return <LoadingSkeleton />;
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Booking</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error || "Booking information unavailable"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // --- Calculations ---
    const completedSessions = booking.package?.sessions.filter((s) => s.isCompleted).length || 0;
    const totalSessions = booking.package?.totalSessions || 0;
    const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "services", label: "Services & Sessions", icon: Package },
        { id: "customer", label: "Customer & Vehicle", icon: User },
        { id: "team", label: "Team", icon: Users },
        { id: "payment", label: "Payment", icon: CreditCard },
    ] as const;

    // --- Tab Content Renderers ---

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-[#5DB7AE]/10 text-[#5DB7AE] rounded-xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Start Date</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(booking.startDate)}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Frequency</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{booking.package?.packageId?.frequency || "N/A"}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Booking Status</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{booking.status?.toLowerCase()}</p>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-end mb-6">
                    <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Progress</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Tracking your {booking.package?.packageId?.name}</p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <span className="text-4xl font-bold text-[#5DB7AE]">{Math.round(progress)}%</span>
                        <span className="text-gray-400 ml-2">Completed</span>
                    </div>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5DB7AE] rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span>0 Sessions</span>
                    <span>{totalSessions} Sessions</span>
                </div>
            </div>

            {/* Basic Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Booking Info</h3>
                    <div className="space-y-0">
                        <DetailRow icon={FileText} label="Booking ID" value={booking.bookingId} />
                        <DetailRow icon={LayoutDashboard} label="Booking Type" value={booking.bookingType} />
                        <DetailRow icon={Calendar} label="End Date" value={formatDate(booking.endDate)} isLast />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Location Info</h3>
                    <div className="space-y-0">
                        <DetailRow icon={MapPin} label="Building" value={booking.buildingId?.buildingName} />
                        <DetailRow
                            icon={MapPin}
                            label="Area"
                            value={booking.buildingId ? `${booking.buildingId.area}, ${booking.buildingId.city}` : ""}
                        />
                        <DetailRow icon={MapPin} label="Address" value={booking.buildingId?.address} isLast />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderServices = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Main Package */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#5DB7AE] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5DB7AE]/20">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.package?.packageId?.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.package?.packageId?.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400 shadow-sm">
                            {totalSessions} Sessions
                        </span>
                        <span className="px-3 py-1 bg-[#5DB7AE]/10 border border-[#5DB7AE]/20 rounded-lg text-sm font-medium text-[#5DB7AE]">
                            Primary Package
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">Session Schedule</h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed
                            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 ml-2"></div> Pending
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {booking.package?.sessions.map((session, index) => (
                            <SessionCard key={session._id} session={session} index={index} total={totalSessions} type="PACKAGE" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Addons */}
            {booking.addons && booking.addons.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add-on Services</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {booking.addons.map((addon, index) => (
                            <div key={addon._id} className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">Add-on Package {index + 1}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {addon.sessions.map((session, sIndex) => (
                                        <SessionCard key={session._id} session={session} index={sIndex} total={addon.totalSessions} type="ADDON" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderCustomer = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* User Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <User className="w-32 h-32 text-[#5DB7AE]" />
                </div>
                <CardHeader title="Customer Profile" icon={User} />

                <div className="flex flex-col items-center mb-8">
                    {booking.userId?.image && (
                        <img
                            src={booking.userId.image}
                            alt={booking.userId.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md mb-4"
                        />
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.userId?.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{booking.userId?.email}</span>
                </div>

                <div className="space-y-0">
                    <DetailRow icon={Phone} label="Phone Number" value={booking.userId?.phone ? `+${booking.userId.phone}` : "N/A"} />
                    <DetailRow icon={Mail} label="Email Address" value={booking.userId?.email} />
                    <DetailRow
                        icon={MapPin}
                        label="Apartment"
                        value={booking.userId?.apartmentNumber ? `Unit ${booking.userId.apartmentNumber}` : "N/A"}
                        isLast
                    />
                </div>
            </div>

            {/* Vehicle Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Car className="w-32 h-32 text-emerald-600" />
                </div>
                <CardHeader title="Vehicle Details" icon={Car} />

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-600 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{booking.vehicleId?.vehicleModel || "Unknown Model"}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">Registered Vehicle</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1">License Plate</div>
                        <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">{booking.vehicleId?.vehicleNumber || "N/A"}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mb-1">Color</div>
                        <div className="flex items-center justify-center gap-2 font-medium text-gray-900 dark:text-white capitalize">
                            {booking.vehicleId?.color && (
                                <div
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: booking.vehicleId.color }}
                                ></div>
                            )}
                            {booking.vehicleId?.color || "N/A"}
                        </div>
                    </div>
                </div>

                <div className="space-y-0">
                    <DetailRow icon={MapPin} label="Parking Area" value={booking.vehicleId?.parkingArea} />
                    <DetailRow icon={MapPin} label="Parking Number" value={booking.vehicleId?.parkingNumber} isLast />
                </div>
            </div>
        </div>
    );

    const renderTeam = () => (
        <div className="animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <CardHeader
                    title="Assigned Cleaners"
                    icon={Briefcase}
                    action={<button className="text-sm font-medium text-[#5DB7AE] hover:text-[#4a9d91]">Manage Team</button>}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {booking.cleanersAssigned && booking.cleanersAssigned.length > 0 ? (
                        booking.cleanersAssigned.map((cleaner) => (
                            <div
                                key={cleaner._id}
                                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#5DB7AE]/20 hover:bg-[#5DB7AE]/10 transition-colors"
                            >
                                <div className="w-14 h-14 rounded-full bg-[#5DB7AE]/10 text-[#5DB7AE] flex items-center justify-center font-bold text-xl shrink-0">
                                    {cleaner.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{cleaner.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Professional Cleaner</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                cleaner.status === "Available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {cleaner.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                            <Phone className="w-4 h-4" /> Call
                                        </button>
                                        <button className="flex-1 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">No cleaners assigned yet.</div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderPayment = () => (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-900 text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Amount Paid</p>
                        <h2 className="text-5xl font-bold">{formatCurrency(booking.totalPrice)}</h2>
                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Payment {booking.payment?.status}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Details</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-600 dark:text-gray-400">Base Package Price</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.package?.price || 0)}</span>
                        </div>
                        {booking.addons &&
                            booking.addons.map((addon, idx) => (
                                <div key={addon._id} className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-600 dark:text-gray-400">Add-on {idx + 1}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(addon.price)}</span>
                                </div>
                            ))}
                        <div className="flex justify-between items-center py-3 pt-6">
                            <span className="font-bold text-gray-900 dark:text-white">Total</span>
                            <span className="font-bold text-xl text-[#5DB7AE]">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Payment Method</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{booking.payment?.method || "N/A"}</p>
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-[#5DB7AE] hover:bg-[#4a9d91] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#5DB7AE]/30">
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );

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
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${getStatusStyles(
                                                booking.status
                                            )}`}
                                        >
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

                            <div className="flex items-center gap-3">
                                <button className="hidden sm:flex px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm shadow-sm">
                                    Contact Support
                                </button>
                                <button className="px-5 py-2.5 bg-[#5DB7AE] text-white font-medium rounded-xl hover:bg-[#4a9d91] transition-colors text-sm shadow-lg shadow-[#5DB7AE]/30">
                                    Edit Booking
                                </button>
                            </div>
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
                {activeTab === "overview" && renderOverview()}
                {activeTab === "services" && renderServices()}
                {activeTab === "customer" && renderCustomer()}
                {activeTab === "team" && renderTeam()}
                {activeTab === "payment" && renderPayment()}
            </main>
        </div>
    );
};

export default BookingDetails;
