import { Edit, Eye, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useEffect, useState } from "react";
import { getAllBooking } from "../../api/admin/bookingServie";
import BookingAssignComponent from "../../components/booking/BookingAssignComponent";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { getStatusColor } from "../../utils/getStatusColorOfBooking";

import Pagination from "../../components/ui/pagination/Pagination";
import CleanerListModal from "../../components/booking/CleanersListModal";
import { useNavigate } from "react-router";

function Bookings() {
    const [booking, setBooking] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15);
    const [cleanerModal, setCleanerModal] = useState(false);
    const [selectedCleaners, setSelectedCleaners] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllBooking({ status: selectedStatus, search: search, page });
            setBooking(res?.data);
            setTotalPages(res?.totalPages);
        };

        fetchData();
    }, [search, selectedStatus, page]);
    return (
        <div className="w-full">
            <Breadcrumb
                pageName="Bookings"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Bookings", path: "/bookings" },
                ]}
            />
            {/* Search + Filters */}
            {/* Search + Filters */}
            <div className="flex items-center justify-between px-4 mt-4 py-3 bg-white border border-gray-100 rounded-xl mb-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search Booking Ids"
                    className="w-72 px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    onChange={(e: any) => setSearch(e.target.value)}
                />

                {/* Status Filters */}
                <div className="flex items-center gap-2 text-xs font-medium select-none">
                    {["ALL", "PENDING", "ASSIGNED", "IN PROGRESS", "COMPLETED"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setSelectedStatus(item)}
                            className={`
                    px-4 py-1.5 rounded-full transition
                    ${selectedStatus === item ? "bg-[#5DB7AE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                `}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <Table className="bg-white mt-4">
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Booking ID
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Customer
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Package
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Vehicle
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Building
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Assigned To
                        </TableCell>

                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Status
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Date
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Total
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {booking?.map((obj: any) => {
                        return (
                            <TableRow>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {obj?.bookingId}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {obj?.userId?.name}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {obj?.package?.packageId?.name}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    <div className="flex flex-col">
                                        <span className="">
                                            {obj?.vehicleId?.vehicleModel} {obj?.vehicleId?.color}
                                        </span>
                                        <span className="">{obj?.vehicleId?.vehicleNumber}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {obj?.buildingId?.buildingName}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    <BookingAssignComponent
                                        booking={obj}
                                        setSelectedBookingId={setSelectedBookingId}
                                        setSelectedCleaners={setSelectedCleaners}
                                        cleaners={obj?.cleanersAssigned}
                                        setCleanerModal={setCleanerModal}
                                    />
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    <span
                                        className={`
            px-3 py-1 rounded-full  text-[11px] font-semibold 
            ${getStatusColor(obj?.status)}
        `}
                                    >
                                        {obj?.status == "IN PROGRESS" ? "PROGRESS" : obj?.status}
                                    </span>
                                </TableCell>

                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {new Date(obj?.createdAt).toDateString()}
                                </TableCell>
                                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                    {obj?.totalPrice} AED
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={()=>navigate(`/bookings/${obj?._id}`)}
                                            className="p-2 text-brand-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-brand-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
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
        </div>
    );
}

export default Bookings;
