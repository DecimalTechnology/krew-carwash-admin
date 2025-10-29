import React from "react";
import {
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Clock,
  Droplet,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

// Dummy Data
const stats = [
  {
    title: "Total Bookings",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    gradient: "from-[#4a9d91] to-[#6ECFC3]",
  },
  {
    title: "Revenue (AED)",
    value: "485,290",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-[#4a9d91] to-[#6ECFC3]",
  },
  {
    title: "Active Cleaners",
    value: "156",
    change: "+5.1%",
    trend: "up",
    icon: Users,
    gradient: "from-[#4a9d91] to-[#6ECFC3]",
  },
  {
    title: "Completed Today",
    value: "94",
    change: "-2.4%",
    trend: "down",
    icon: CheckCircle,
    gradient: "from-[#4a9d91] to-[#6ECFC3]",
  },
];

const recentBookings = [
  {
    id: "#BK-2847",
    customer: "Ahmed Al Maktoum",
    building: "Marina Heights",
    location: "Dubai Marina",
    service: "Premium Wash",
    carType: "SUV",
    status: "Completed",
    amount: "AED 180",
    time: "10:30 AM",
  },
  {
    id: "#BK-2846",
    customer: "Fatima Hassan",
    building: "Business Bay Tower",
    location: "Business Bay",
    service: "Express Wash",
    carType: "Sedan",
    status: "In Progress",
    amount: "AED 120",
    time: "11:15 AM",
  },
  {
    id: "#BK-2845",
    customer: "Mohammed Ali",
    building: "Downtown Residence",
    location: "Downtown Dubai",
    service: "Deluxe Package",
    carType: "Luxury",
    status: "Scheduled",
    amount: "AED 250",
    time: "12:00 PM",
  },
  {
    id: "#BK-2844",
    customer: "Sara Abdullah",
    building: "JBR Walk",
    location: "Jumeirah Beach",
    service: "Interior Cleaning",
    carType: "Sedan",
    status: "Completed",
    amount: "AED 150",
    time: "09:45 AM",
  },
  {
    id: "#BK-2843",
    customer: "Khalid Ahmed",
    building: "Emirates Hills",
    location: "Emirates Hills",
    service: "Premium Wash",
    carType: "SUV",
    status: "Pending",
    amount: "AED 180",
    time: "01:30 PM",
  },
];

const topLocations = [
  { name: "Dubai Marina", bookings: 487, revenue: "AED 87,660", growth: "+15%" },
  { name: "Business Bay", bookings: 392, revenue: "AED 70,560", growth: "+12%" },
  { name: "Downtown Dubai", bookings: 356, revenue: "AED 64,080", growth: "+8%" },
  { name: "Jumeirah Beach", bookings: 298, revenue: "AED 53,640", growth: "+18%" },
];

const topCleaners = [
  { name: "Ahmed Hassan", completed: 142, rating: 4.9, revenue: "AED 25,560" },
  { name: "Mohammed Rashed", completed: 128, rating: 4.8, revenue: "AED 23,040" },
  { name: "Youssef Ibrahim", completed: 115, rating: 4.9, revenue: "AED 20,700" },
  { name: "Ali Mansoor", completed: 103, rating: 4.7, revenue: "AED 18,540" },
];

const serviceBreakdown = [
  { service: "Premium Wash", bookings: 892, percentage: 31 },
  { service: "Express Wash", bookings: 741, percentage: 26 },
  { service: "Deluxe Package", bookings: 598, percentage: 21 },
  { service: "Interior Cleaning", bookings: 427, percentage: 15 },
  { service: "Basic Wash", bookings: 189, percentage: 7 },
];

function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "info";
      case "Scheduled":
        return "warning";
      case "Pending":
        return "warning";
      default:
        return "light";
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
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] hover:from-[#3a7d74] hover:to-[#5DB7AE] text-white rounded-lg transition">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-3">
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
                    </div>
                  </div>
                  <div
                    className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
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
                {recentBookings.map((booking) => (
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
            {topCleaners.map((cleaner, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3] text-white font-bold">
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
            {topLocations.map((location, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3] text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{location.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{location.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{location.revenue}</p>
                    <p className="text-xs text-green-600">{location.growth}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] h-2 rounded-full transition-all duration-500"
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Popular services this month</p>
          </div>
          <div className="p-6 space-y-4">
            {serviceBreakdown.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3]"></div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{service.service}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{service.bookings}</span>
                    <span className="text-sm font-medium text-[#5DB7AE]">{service.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] h-2 rounded-full transition-all duration-500"
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
        <div className="bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3] rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Schedule Booking</h3>
          <p className="text-white/90 text-sm mb-4">Create a new booking for your customers</p>
          <button className="px-4 py-2 bg-white text-[#5DB7AE] rounded-lg hover:bg-gray-100 transition font-medium">
            New Booking
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3] rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Manage Cleaners</h3>
          <p className="text-white/90 text-sm mb-4">View and assign cleaners to jobs</p>
          <button className="px-4 py-2 bg-white text-[#5DB7AE] rounded-lg hover:bg-gray-100 transition font-medium">
            View Cleaners
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#4a9d91] to-[#6ECFC3] rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
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
