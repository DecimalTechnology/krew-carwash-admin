import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Eye, Trash } from "lucide-react";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import SearchBox from "../../components/ui/SearchBox";
import TableLoading from "../../components/ui/table/TableLoading";
import Switch from "../../components/ui/switch/Switch";

import toast from "react-hot-toast";

import Pagination from "../../components/ui/pagination/Pagination";
// import CleanerViewModal from "../../components/cleaners/CleanerViewModal";
import CleanerAddEditModal from "../../components/cleaner/CleanerEditModal";
import { createCleaner, getAllCleaners, getPassword, updateCleaner } from "../../api/admin/cleanerService";
export default function Cleaners() {
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
            
            setCleaners((prev) =>
                prev.map((cl) => (cl._id === cleanerId ? updatedCleaner : cl))
            );
            setAddEditModalOpen(false)
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleAddCleaner = async (payload: any) => {
        const res = await createCleaner(payload);
        const newCleaner = res?.data;

        setCleaners((prev) => [...prev, newCleaner]);
        setAddEditModalOpen(false)
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
            <div className="p-4">
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 md:flex-1">
                        {["All", "Available", "On Task", "On Leave"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab.toLowerCase())}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                    statusFilter === tab.toLowerCase()
                                        ? "bg-brand-500 text-white"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-48 md:static md:mx-auto">
                        <SearchBox search={search} setSearch={setSearch} className="h-10 w-full" />
                    </div>

                    {/* Sort */}
                    <div className="flex flex-nowrap gap-2 items-center md:flex-1 md:justify-end">
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="h-10 border rounded px-3 bg-white dark:bg-gray-900 dark:text-white"
                        >
                            <option value="name">Name</option>
                            <option value="createdAt">Created Date</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                            className="h-10 border rounded px-3"
                        >
                            {sortOrder === "asc" ? "▲" : "▼"}
                        </button>
                        <button
                            onClick={() => {setAddEditModalOpen(true);setSelectedCleaner(null)}}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Add New Cleaner
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <TableLoading />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        No
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Cleaner ID
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Name
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Phone
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Email
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Image
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Status
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Active
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Created At
                                    </TableCell>
                                    <TableCell>Credentials</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {cleaners?.map((cl, index) => (
                                    <TableRow key={cl._id}>
                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{index + 1}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{cl.cleanerId}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{cl.name}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{cl.phone}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{cl.email}</TableCell>

                                        <TableCell className="px-4 py-3">
                                            <img src={cl.image || "no-profile.jpg"} className="w-10 h-10 object-cover rounded-full" />
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">{cl.status}</TableCell>

                                        <TableCell className="px-4 py-3">
                                            <Switch checked={cl.isActive} onChange={() => handleUpdate({ isActive: !cl.isActive }, cl._id)} />
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-800 dark:text-white/90">
                                            {new Date(cl.createdAt).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <button
                                                className="px-3 py-1 bg-brand-500 text-white rounded-md hover:bg-brand-600"
                                                onClick={async() => {
                                                    const res = await getPassword(cl?._id)
                                                    
                                                    const text = `Cleaner ID: ${cl.cleanerId}\nPassword: ${res?.data?.password }`;
                                                    navigator.clipboard.writeText(text);
                                                    toast.success("Credentials copied!");
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 flex gap-2 text-gray-800 dark:text-white/90">
                                            <button onClick={()=>{setAddEditModalOpen(true);setSelectedCleaner(cl)}} className="p-2 text-blue-500">
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedCleanerId(cl._id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="p-2 text-red-500"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            {/* {deleteModalOpen && (
                <DeleteModal
                    type="Cleaner"
                    isOpen={deleteModalOpen}
                    handleDelete={async (confirm: boolean) => {
                        if (confirm) {
                            await updateCleaner({ isActive: false }, selectedCleanerId);
                            setRefresh(!refresh);
                        }
                        setDeleteModalOpen(false);
                    }}
                />
            )} */}
            {addEditModalOpen && <CleanerAddEditModal cleaner={selectedCleaner} onClose={() => setAddEditModalOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
}
