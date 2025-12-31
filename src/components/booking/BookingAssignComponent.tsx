import { useEffect } from "react";

function BookingAssignComponent({
    cleaners = [],
    setCleanerModal,
    setSelectedCleaners,
    booking,
    setSelectedBookingId,
}: any) {
    const hasCleaners = cleaners.length > 0;

    const letterColors = [
        "text-purple-600",
        "text-blue-600",
        "text-green-600",
        "text-orange-600",
        "text-red-600",
        "text-yellow-600",
        "text-pink-600",
    ];

    const getLetterColor = (index: number) => {
        return letterColors[index % letterColors.length];
    };

    useEffect(() => {
            const id = localStorage.getItem("bookingId");
            if (id) {
                  setCleanerModal(true);
        setSelectedCleaners(cleaners);
        setSelectedBookingId(booking?._id);
    
                localStorage.removeItem("bookingId");
            }
        }, []);

    const openAssignModal = () => {
        setCleanerModal(true);
        setSelectedCleaners(cleaners);
        setSelectedBookingId(booking?._id);
    };

    return (
        <div className="flex items-center">
            {hasCleaners ? (
                <>
                    {cleaners.map((cleaner: any, index: number) => (
                        <div
                            key={index}
                            className="w-8 h-8 rounded-full overflow-hidden
                            flex items-center justify-center
                            border-2 border-white dark:border-gray-800
                            bg-gray-200 dark:bg-gray-700
                            -ml-2 first:ml-0"
                            style={{ zIndex: cleaners.length - index }}
                        >
                            {cleaner?.image ? (
                                <img
                                    src={cleaner.image}
                                    alt="cleaner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span
                                    className={`font-bold text-sm ${getLetterColor(index)}`}
                                >
                                    {cleaner?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    ))}

                    {/* PLUS BUTTON */}
                    <button
                        onClick={openAssignModal}
                        
                        className="w-8 h-8 rounded-full 
                        bg-gray-100 dark:bg-gray-800
                        border border-gray-300 dark:border-gray-600
                        flex items-center justify-center
                        text-lg font-semibold
                        text-gray-700 dark:text-gray-300
                        -ml-2 hover:bg-gray-200 dark:hover:bg-gray-700
                        transition"
                    >
                        +
                    </button>
                </>
            ) : (
                /* Assign button */
                <button
    disabled={booking?.payment?.status !== "COMPLETED"}
    onClick={openAssignModal}
    className={`
        flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-sm font-medium transition
        border

        ${
            booking?.payment?.status !== "COMPLETED"
                ? "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-[#5DB7AE] border-[#5DB7AE] text-white hover:bg-[#4a9d91] shadow-md"
        }
    `}
    title={
        booking?.payment?.status !== "COMPLETED"
            ? "Complete payment to assign"
            : "Assign team"
    }
>
    Assign
    <span className="text-lg leading-none">+</span>
</button>

            )}
        </div>
    );
}

export default BookingAssignComponent;
