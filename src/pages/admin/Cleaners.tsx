/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import SearchBox from "../../components/ui/SearchBox";
import TableLoading from "../../components/ui/table/TableLoading";
import Switch from "../../components/ui/switch/Switch";

import toast from "react-hot-toast";

import Pagination from "../../components/ui/pagination/Pagination";
// import CleanerViewModal from "../../components/cleaners/CleanerViewModal";
import CleanerAddEditModal from "../../components/cleaner/CleanerEditModal";
import { createCleaner, getAllCleaners, getPassword, updateCleaner } from "../../api/admin/cleanerService";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";
export default function Cleaners() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [cleaners, setCleaners] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCleanerId, setSelectedCleanerId] = useState("");

    const [addEditModalOpen, setAddEditModalOpen] = useState(false);
    const [selectedCleaner, setSelectedCleaner] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllCleaners({
                    search,
                    status: statusFilter,
                    sortedBy: sortKey,
                    sortOrder,
                    page,
                });
                console.log(res?.data);
                setLoading(false);
                setCleaners(res?.data?.cleaners || []);
                setTotalPages(res?.data?.pagination?.totalPages || 1);
            } catch (error: any) {
                toast.error(error?.message || "Something went wrong");
            }
        };

        fetchData();
    }, [search, statusFilter, sortKey, sortOrder, page, refresh]);

    const handleUpdate = async (payload: any, cleanerId: string) => {
        try {
            const res = await updateCleaner(payload, cleanerId);
            const updatedCleaner = res?.data;

            setCleaners((prev) => prev.map((cl) => (cl._id === cleanerId ? updatedCleaner : cl)));
            setAddEditModalOpen(false);
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleAddCleaner = async (payload: any) => {
        const res = await createCleaner(payload);
        const newCleaner = res?.data;

        setCleaners((prev) => [...prev, newCleaner]);
        setAddEditModalOpen(false);
    };
    const handleSubmit = (payload: any) => {
        if (selectedCleaner) {
            handleUpdate(payload, selectedCleaner?._id);
        } else {
            handleAddCleaner(payload);
        }
    };
    return (
        <div className="space-y-4">
            <Breadcrumb
                pageName="Cleaners"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Cleaners", path: "/cleaners" },
                ]}
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-4">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 md:flex-1">
                            {["All", "Active", "Inactive"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setStatusFilter(tab.toLowerCase())}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        statusFilter === tab.toLowerCase() ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Centered Search */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-48 md:static md:mx-auto">
                            <SearchBox search={search} setSearch={setSearch} className="h-10 w-full" />
                        </div>

                        {/* Right side controls */}
                        <div className="flex flex-nowrap gap-2 items-center md:flex-1 md:justify-end">
                            <select
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="h-10 border rounded px-3 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="name">Name</option>
                                <option value="createdAt">Created Date</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                                className="h-10 border rounded px-3 flex items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                                title={sortOrder === "asc" ? "Ascending" : "Descending"}
                            >
                                {sortOrder === "asc" ? "▲" : "▼"}
                            </button>
                            <button
                                onClick={() => {
                                    setAddEditModalOpen(true);
                                    setSelectedCleaner(null);
                                }}
                                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Add New Cleaner
                            </button>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <TableLoading />
                ) : (
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell className="pl-4 pr-0.5 py-2.5 font-medium text-gray-500 text-start text-xs dark:text-gray-400 select-none">
                                    No
                                </TableCell>
                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-start text-xs dark:text-gray-400 select-none">ID</TableCell>
                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-start text-xs dark:text-gray-400 select-none">Cleaner Info</TableCell>
                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-start text-xs dark:text-gray-400 select-none">Contact</TableCell>

                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-center text-xs dark:text-gray-400 select-none">Active</TableCell>
                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-center text-xs dark:text-gray-400 select-none">Credentials</TableCell>
                                <TableCell className="px-0.5 py-2.5 font-medium text-gray-500 text-center text-xs dark:text-gray-400 select-none">Actions</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {cleaners?.map((cl, index) => (
                                <TableRow key={cl._id}>
                                    <TableCell className="pl-4 pr-1.5 py-2.5 text-gray-800 text-start text-sm dark:text-white/90">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-gray-800 text-start text-sm dark:text-white/90 font-mono">{cl.cleanerId}</TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-gray-800 text-start text-sm dark:text-white/90">
                                        <div className="flex items-center gap-2">
                                            <img src={cl.image || "no-profile.jpg"} alt="cleaner" className="w-8 h-8 object-cover rounded-full" />
                                            <div>
                                                <div className="font-medium text-sm">{cl.name}</div>
                                                <div className="text-xs text-gray-500">{new Date(cl.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-gray-500 text-start text-sm dark:text-gray-400">
                                        <div>
                                            <div className="text-sm">{cl.phone}</div>
                                            <div className="text-xs text-gray-400">{cl.email || "N/A"}</div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-center">
                                        <div className="flex items-center justify-center">
                                            <Switch checked={cl.isActive} onChange={() => handleUpdate({ isActive: !cl.isActive }, cl._id)} size="sm" color="success" />
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-center">
                                        <button
                                            className="px-2.5 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600 text-xs"
                                            onClick={async () => {
                                                const res = await getPassword(cl?._id);
                                                const text = `Cleaner ID: ${cl.cleanerId}\nPassword: ${res?.data?.password}`;
                                                navigator.clipboard.writeText(text);
                                                toast.success("Credentials copied!");
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </TableCell>

                                    <TableCell className="px-1.5 py-2.5 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => navigate(`/cleaners/${cl._id}`)}
                                                className="p-1.5 text-[#5DB7AE] hover:text-[#4a9d91] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCleaner(cl);
                                                    setAddEditModalOpen(true);
                                                }}
                                                className="p-1.5 text-[#5DB7AE] hover:text-[#4a9d91] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCleanerId(cl._id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(pg: number) => setPage(pg)} />
            </div>

            <DeleteModal
                type="Cleaner"
                isOpen={deleteModalOpen}
                handleDelete={async (confirm: boolean) => {
                    if (confirm) {
                        await updateCleaner({ isDeleted: true }, selectedCleanerId);
                        setCleaners((prev: any) => prev.filter((obj: any) => obj?._id !== selectedCleanerId));
                    }
                    setDeleteModalOpen(false);
                }}
            />

            {addEditModalOpen && <CleanerAddEditModal cleaner={selectedCleaner} onClose={() => setAddEditModalOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
}