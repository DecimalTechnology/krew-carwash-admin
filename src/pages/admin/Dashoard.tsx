/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useRef } from "react";
import {
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Droplet,
  CheckCircle,
 
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import { getAdminDashboard } from "../../api/admin/dashboardService";
import toast from "react-hot-toast";
import { generateDashboardPDF } from "../../utils/generateDashboardPDF";

type RecentBookingRow = {
  id: string;
  customer: string;
  building: string;
  location: string;
  service: string;
  carType: string;
  status: string;
  amount: string;
  time: string;
};

type CleanerRow = {
  name: string;
  completed: number;
  rating?: number;
  revenue?: string;
};

type LocationRow = {
  name: string;
  bookings: number;
  revenue: string | number;
};

type ServiceRow = {
  service: string;
  bookings: number;
  percentage: number;
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>("last_7_days");
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const cacheRef = useRef<Map<string, any>>(new Map());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "Completed":
        return "success";
      case "IN PROGRESS":
      case "In Progress":
        return "info";
      case "SCHEDULED":
      case "Scheduled":
        return "warning";
      case "PENDING":
      case "Pending":
        return "warning";
      default:
        return "light";
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        if (cacheRef.current.has(range)) {
          if (!mounted) return;
          setDashboardData(cacheRef.current.get(range));
          setLoading(false);
          return;
        }
        const res = await getAdminDashboard({ range });
        const payload = res?.data ?? res;
        if (!payload || !payload.stats) {
          toast.error("Dashboard API returned unexpected payload — check network response.");
        }
        cacheRef.current.set(range, payload);
        if (mounted) setDashboardData(payload);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        toast.error("Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, [range]);

  const stats = useMemo(() => {
    const s = dashboardData?.stats || {};
    return [
      { title: "Total Bookings", value: String(s.totalBookings || 0), change: "", trend: "up", icon: Calendar },
      { title: "Revenue (AED)", value: `AED ${Number(s.revenue || 0).toLocaleString()}`, change: "", trend: "up", icon: DollarSign },
      { title: "Active Cleaners", value: String(s.activeCleaners || 0), change: "", trend: "up", icon: Users },
      { title: "Completed", value: String(s.completed || 0), change: "", trend: "up", icon: CheckCircle },
    ];
  }, [dashboardData]);

  const recentBookings = useMemo(() => {
    return (dashboardData?.recentBookings || dashboardData?.bookings || []).slice(0, 5).map((b: any) => ({
      id: b?.bookingId || b?._id,
      customer: b?.userId?.name || "N/A",
      building: b?.buildingId?.buildingName || "N/A",
      location: b?.buildingId?.location || "N/A",
      service: b?.package?.packageId?.name || "N/A",
      carType: b?.vehicleId?.vehicleModel || b?.vehicleTypeId?.name || "N/A",
      status: b?.status || "N/A",
      amount: `AED ${Number(b?.totalPrice || 0).toLocaleString()}`,
      time: new Date(b?.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }, [dashboardData]);

  const topLocations = useMemo(() => {
    return (dashboardData?.topLocations || []).map((l: any) => ({
      name: l.name,
      bookings: l.bookings,
      revenue: typeof l.revenue === "number" ? `AED ${l.revenue.toLocaleString()}` : l.revenue,
    })).slice(0, 4);
  }, [dashboardData]);

  const topCleaners = useMemo(() => {
    return (dashboardData?.topCleaners || []).map((c: any) => ({
      name: c.name,
      completed: c.completed,
      rating: c.rating || 0,
      revenue: c.revenue || "",
    })).slice(0, 4);
  }, [dashboardData]);

  const serviceBreakdown = useMemo(() => {
    const totalBookingsForPercent = dashboardData?.stats?.totalBookings ?? 1;
    return (dashboardData?.serviceBreakdown || []).map((s: any) => ({
      service: s.service,
      bookings: s.bookings,
      percentage: s.percentage ?? Math.round((s.bookings / Math.max(1, totalBookingsForPercent)) * 100),
    })).slice(0, 5);
  }, [dashboardData]);

  // payments handled in PDF util when needed; keep backend-driven payload available on dashboardData

  const handleExportReport = async () => {
    if (!dashboardData) {
      toast.error("No dashboard data to export");
      return;
    }
    try {
      await generateDashboardPDF(dashboardData, range);
    } catch (err) {
      // generateDashboardPDF already shows toast; ensure any unexpected errors are logged
      console.error("Export failed", err);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
              }}
              className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-900"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>

          {/* From/To custom range removed — use preset dropdown only */}

          <button onClick={handleExportReport} className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition">
            Export Report
          </button>
          
        </div>
      </div>

      {/* Stats Grid */}
      {loading && (
        <div className="p-4 bg-white rounded-md text-sm text-gray-500">Loading dashboard...</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
                    {/* <div className="flex items-center gap-1 mt-3">
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                    </div> */}
                  </div>
                  <div
                    className="p-3 bg-brand-500 rounded-lg group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="h-1 bg-brand-500"></div>
            </div>
          );
        })}
      </div>
      

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest booking activities</p>
              </div>
              <button className="text-sm text-[#5DB7AE] hover:text-[#4a9d91] font-medium">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {recentBookings.map((booking: RecentBookingRow) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.id}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{booking.customer}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{booking.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white">{booking.building}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white">{booking.service}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {booking.carType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getStatusColor(booking.status) as any} size="sm" variant="light">
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Cleaners */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Cleaners</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month's performers</p>
          </div>
          <div className="p-6 space-y-4">
            {topCleaners.map((cleaner: CleanerRow, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{cleaner.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{cleaner.completed} jobs</span>
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <Star className="w-3 h-3 fill-yellow-600" />
                      {cleaner.rating}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#5DB7AE] mt-1">{cleaner.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5DB7AE]" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Locations</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most active areas in UAE</p>
          </div>
          <div className="p-6 space-y-4">
            {topLocations.map((location: LocationRow, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{location.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{location.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{location.revenue}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(location.bookings / 500) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-[#5DB7AE]" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Breakdown</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Popular services</p>
          </div>
          <div className="p-6 space-y-4">
            {serviceBreakdown.map((service: ServiceRow, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{service.service}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{service.bookings}</span>
                    <span className="text-sm font-medium text-[#5DB7AE]">{service.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Schedule Booking</h3>
          <p className="text-white/90 text-sm mb-4">Create a new booking for your customers</p>
          <button className="px-4 py-2 bg-white text-[#5DB7AE] rounded-lg hover:bg-gray-100 transition font-medium">
            New Booking
          </button>
        </div>

        <div className="bg-brand-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Manage Cleaners</h3>
          <p className="text-white/90 text-sm mb-4">View and assign cleaners to jobs</p>
          <button className="px-4 py-2 bg-white text-[#5DB7AE] rounded-lg hover:bg-gray-100 transition font-medium">
            View Cleaners
          </button>
        </div>

        <div className="bg-brand-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
          <TrendingUp className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-white/90 text-sm mb-4">View detailed reports and insights</p>
          <button className="px-4 py-2 bg-white text-[#5DB7AE] rounded-lg hover:bg-gray-100 transition font-medium">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
