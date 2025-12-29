import { Eye, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useEffect, useState } from "react";
import { deleteBooking, getAllBooking } from "../../api/admin/bookingServie";
import BookingAssignComponent from "../../components/booking/BookingAssignComponent";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { getStatusColor } from "../../utils/getStatusColorOfBooking";

import Pagination from "../../components/ui/pagination/Pagination";
import CleanerListModal from "../../components/booking/CleanersListModal";
import { useNavigate } from "react-router";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";

function Bookings() {
    const [booking, setBooking] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15);
    const [cleanerModal, setCleanerModal] = useState(false);
    const [selectedCleaners, setSelectedCleaners] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllBooking({ status: selectedStatus, search, page });
            setBooking(res?.data);
            setTotalPages(res?.totalPages);
        };

        fetchData();
    }, [search, selectedStatus, page]);

    return (
        <div className="w-full text-gray-800 dark:text-gray-200">
            <Breadcrumb
                pageName="Bookings"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Bookings", path: "/bookings" },
                ]}
            />

            {/* Search + Filters */}
            <div
                className="flex items-center justify-between px-4 mt-4 py-3 
                bg-white dark:bg-gray-900 
                border border-gray-100 dark:border-gray-700 
                rounded-xl mb-4"
            >
                <input
                    type="text"
                    placeholder="Search Booking Ids"
                    className="w-72 px-4 py-2 text-sm rounded-lg 
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-600
                    text-gray-800 dark:text-gray-200
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:border-black dark:focus:border-white
                    focus:outline-none"
                    onChange={(e: any) => setSearch(e.target.value)}
                />

                <div className="flex items-center gap-2 text-xs font-medium select-none">
                    {["ALL", "PENDING", "ASSIGNED", "IN PROGRESS", "COMPLETED"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setSelectedStatus(item)}
                            className={`px-4 py-1.5 rounded-full transition
                            ${selectedStatus === item ? "bg-[#5DB7AE] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Table className="bg-white dark:bg-gray-900 mt-4 rounded-xl overflow-hidden">
                <TableHeader className="border-b border-gray-100 dark:border-gray-700">
                    <TableRow>
                        {["Booking ID", "Customer", "Package", "Vehicle", "Building", "Assigned To", "Booking Status", "Payment Status", "Date", "Total", "Actions"].map((head) => (
                            <TableCell key={head} className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-theme-xs select-none">
                                {head}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {booking?.map((obj: any) => (
                        <TableRow key={obj?._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">{obj?.bookingId}</TableCell>

                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">{obj?.userId?.name}</TableCell>
                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">
                                {obj?.package?.packageId?.name ? (
                                    <>
                                        {obj.package.packageId.name}
                                        {obj?.addons?.length > 0 && ` and ${obj.addons.length} Addon${obj.addons.length > 1 ? "s" : ""}`}
                                    </>
                                ) : obj?.addons?.length > 0 ? (
                                    `${obj.addons.length} Addon${obj.addons.length > 1 ? "s" : ""}`
                                ) : (
                                    "—"
                                )}
                            </TableCell>

                            <TableCell className="px-5 py-3">
                                {obj?.vehicleId ? (
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white font-medium text-sm">{obj.vehicleId.vehicleModel}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{obj.vehicleId.vehicleNumber}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{obj?.vehicleTypeId?.name || "N/A"}</span>
                                )}
                            </TableCell>

                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">{obj?.buildingId?.buildingName}</TableCell>

                            <TableCell className="px-5 py-3">
                                <BookingAssignComponent
                                    booking={obj}
                                    setSelectedBookingId={setSelectedBookingId}
                                    setSelectedCleaners={setSelectedCleaners}
                                    cleaners={obj?.cleanersAssigned}
                                    setCleanerModal={setCleanerModal}
                                />
                            </TableCell>

                            <TableCell className="px-5 py-3">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(obj?.status)}`}>{obj?.status === "IN PROGRESS" ? "PROGRESS" : obj?.status}</span>
                            </TableCell>
                            <TableCell className="px-5 py-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-[11px] font-semibold
      ${
          obj?.payment?.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : obj?.payment?.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : obj?.payment?.status === "FAILED"
              ? "bg-red-100 text-red-700"
              : obj?.payment?.status === "CANCELLED"
              ? "bg-gray-200 text-gray-700"
              : "bg-slate-100 text-slate-600"
      }
    `}
                                >
                                    {obj?.payment?.status}
                                </span>
                            </TableCell>

                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">{new Date(obj?.createdAt).toDateString()}</TableCell>

                            <TableCell className="px-5 py-3 text-gray-500 dark:text-gray-400">{obj?.totalPrice} AED</TableCell>

                            <TableCell className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/bookings/${obj?._id}`)}
                                        className="p-2 text-brand-500 hover:text-brand-600 
                                        hover:bg-gray-100 dark:hover:bg-gray-800 
                                        rounded-lg transition"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setBookingId(obj?._id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="p-2 text-red-500 hover:text-red-600 
                                        hover:bg-gray-100 dark:hover:bg-gray-800 
                                        rounded-lg transition"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CleanerListModal
                setBooking={setBooking}
                selectedBookingId={selectedBookingId}
                setSelectedCleaners={setSelectedCleaners}
                selectedCleaners={selectedCleaners}
                onClose={() => setCleanerModal(false)}
                isOpen={cleanerModal}
            />

            <Pagination currentPage={page} totalPages={Math.ceil(Number(totalPages) / 10)} onPageChange={(page: any) => setPage(page)} />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                handleDelete={async (action: boolean) => {
                    if (!action) setIsDeleteModalOpen(false);
                    else {
                        await deleteBooking(bookingId as string);
                        setBooking(booking.filter((obj: any) => obj?._id !== bookingId));
                        setIsDeleteModalOpen(false);
                    }
                }}
                type="Booking"
            />
        </div>
    );
}

export default Bookings;
