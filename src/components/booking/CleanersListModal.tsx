import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { assignCleaner, getCleanersList, unAssignCleaner } from "../../api/admin/bookingServie";

const CleanerListModal = ({ isOpen, onClose, selectedCleaners, setSelectedCleaners, setBooking, selectedBookingId }: any) => {
    if (!isOpen) return null;

    const [cleaners, setCleaners] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCleanersList();
            setCleaners(res?.data || []);
        };
        fetchData();
    }, []);

    const isAssigned = (cleanerId: string) => selectedCleaners.some((obj: any) => obj?._id.toString() === cleanerId.toString());

    // COLOR MAP BASED ON FIRST LETTER
    const getColor = (letter: string) => {
        const map: any = {
            A: "bg-blue-500",
            B: "bg-purple-500",
            C: "bg-orange-500",
            D: "bg-emerald-500",
            E: "bg-red-500",
            F: "bg-yellow-500",
            G: "bg-lime-500",
            H: "bg-teal-500",
            I: "bg-indigo-500",
            J: "bg-pink-500",
            K: "bg-rose-500",
            L: "bg-cyan-500",
            M: "bg-violet-500",
            N: "bg-green-600",
            O: "bg-fuchsia-500",
            P: "bg-amber-600",
            Q: "bg-sky-500",
            R: "bg-stone-500",
            S: "bg-red-600",
            T: "bg-blue-600",
            U: "bg-indigo-600",
            V: "bg-emerald-600",
            W: "bg-teal-600",
            X: "bg-purple-600",
            Y: "bg-rose-600",
            Z: "bg-orange-600",
        };

        return map[letter?.toUpperCase()] || "bg-gray-400";
    };

    const handleSelect = async (newCleaner: any) => {
        const res = await assignCleaner(newCleaner?._id, selectedBookingId);

        setSelectedCleaners((prev: any) => [...prev, newCleaner]);
        setBooking((prev: any) =>
            prev.map((obj: any) =>
                obj?._id === selectedBookingId
                    ? {
                          ...obj,
                          cleanersAssigned: [...obj?.cleanersAssigned, newCleaner],
                          status: res?.data?.status,
                      }
                    : obj
            )
        );
    };

    const removeCleaner = async (cleaner: any) => {
        const res = await unAssignCleaner(cleaner?._id, selectedBookingId);

        setSelectedCleaners((prev: any) => prev.filter((c: any) => c._id.toString() !== cleaner._id.toString()));

        setBooking((prev: any) =>
            prev.map((obj: any) =>
                obj?._id === selectedBookingId
                    ? {
                          ...obj,
                          cleanersAssigned: obj.cleanersAssigned.filter((c: any) => c._id.toString() !== cleaner._id.toString()),
                          status: res?.data?.status,
                      }
                    : obj
            )
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Assign Cleaner</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
                        ✕
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select a cleaner from the list below</p>

                {/* Cleaner List */}
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {cleaners.map((c: any) => {
                        const first = c?.name?.charAt(0) || "?";
                        const assigned = isAssigned(c._id);

                        return (
                            <div
                                key={c._id}
                                className="p-4 rounded-xl border
                                border-gray-200 dark:border-gray-700
                                flex items-center justify-between transition
                                hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {/* Avatar + Details */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center 
                                        text-white font-medium ${getColor(first)}`}
                                    >
                                        {first}
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{c?.name}</p>

                                        {c?.phone && <p className="text-xs text-gray-600 dark:text-gray-400">📞 {c.phone}</p>}

                                        {c?.email && <p className="text-xs text-gray-600 dark:text-gray-400">✉️ {c.email}</p>}

                                        <p className={`text-xs mt-1 ${assigned ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                                            {assigned ? "Assigned" : "Not assigned"}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div>
                                    {assigned ? (
                                        <button onClick={() => removeCleaner({ _id: c?._id, name: c?.name })} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition">
                                            <Trash2 size={16} />
                                        </button>
                                    ) : (
                                        <button  onClick={() => handleSelect({ _id: c?._id, name: c.name })} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
                                            <Plus size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg
                        bg-gray-200 dark:bg-gray-800
                        text-gray-800 dark:text-gray-200
                        hover:bg-gray-300 dark:hover:bg-gray-700
                        transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CleanerListModal;
