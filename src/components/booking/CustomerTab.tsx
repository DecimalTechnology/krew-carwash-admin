import React from "react";
import { User, Car, Phone, Mail, MapPin } from "lucide-react";

import { BookingData } from "../../interface/IBooking";
import CardHeader from "./CardHeader";
import DetailRow from "./DetailRow";

interface CustomerTabProps {
    booking: BookingData;
}

const CustomerTab: React.FC<CustomerTabProps> = ({ booking }) => {
    return (
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
                    <DetailRow icon={MapPin} label="Apartment" value={booking.userId?.apartmentNumber ? `Unit ${booking.userId.apartmentNumber}` : "N/A"} isLast />
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
                                <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: booking.vehicleId.color }}></div>
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
};

export default CustomerTab;