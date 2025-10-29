import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Eye, Trash } from "lucide-react";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import SearchBox from "../../components/ui/SearchBox";
import TableLoading from "../../components/ui/table/TableLoading";
import Switch from "../../components/ui/switch/Switch";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";
import toast from "react-hot-toast";
import Pagination from "../../components/ui/pagination/Pagination";
import BuildingViewModal from "../../components/building/BuildingViewModal";
import { useNavigate } from "react-router-dom";

import { getAllBuildings, updateBuilding } from "../../api/admin/buildingService";
import { IBuilding } from "../../interface/IBuilding";

export default function Buildings() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(null);
    const [buildings, setBuildings] = useState<IBuilding[]>([]);
    const [fetch, setFetch] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllBuildings({
                    search,
                    status: statusFilter,
                    sortedBy: sortKey,
                    sortOrder,
                    page,
                    limit
                });
                setBuildings(res?.data);
                setTotalPages(res?.data?.pagination?.totalPages || 1);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.error("Failed to fetch buildings");
            }
        };
        fetchData();
    }, [search, statusFilter, sortKey, sortOrder, page, limit, fetch]);

    const handleUpdate = async (payload: any, buildingId: string) => {
        try {
            const res = await updateBuilding(payload, buildingId);
            const updatedBuilding = res?.data;
            setBuildings((prev) =>
                prev.map((b) => (b._id === buildingId ? updatedBuilding : b))
            );
            toast.success("Building updated successfully");
        } catch (err) {
            toast.error("Failed to update building");
        }
    };

    return (
        <div className="space-y-4">
            <Breadcrumb
                pageName="Buildings"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Buildings", path: "/buildings" },
                ]}
            />

            <div className="w-full flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                    {["All", "Active", "Inactive"].map((tab) => (
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

                <SearchBox
                    search={search}
                    setSearch={setSearch}
                    className="h-10 w-48"
                />

                <button
                  
                    onClick={() => navigate("/add-building")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Add New Building
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <TableLoading />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">No</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Name</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Email</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Phone</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Coordinates</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none"> Active</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Created At</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Updated At</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {buildings.map((b, index) => (
                                    <TableRow key={b._id}>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">{b.name}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">{b.email || "-"}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">{b.contactNumbers.join(", ") || "-"}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {b.coordinates
                                                ? `${b.coordinates.latitude}, ${b.coordinates.longitude}`
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            <Switch
                                                checked={b.isActive}
                                                onChange={() =>
                                                    handleUpdate({ isActive: !b?.isActive }, b?._id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {new Date(b.updatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBuilding(b);
                                                        setViewModalOpen(true);
                                                    }}
                                                    className="p-2 text-[#5DB7AE] hover:text-[#4a9d91] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBuildingId(b._id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
            />

            {viewModalOpen && selectedBuilding && (
                <BuildingViewModal
                    building={selectedBuilding}
                    onClose={() => setViewModalOpen(false)}
                />
            )}

            {deleteModalOpen && (
                <DeleteModal
                    isOpen={deleteModalOpen}
                    type="Building"
                    handleDelete={async (confirmed: boolean) => {
                        if (confirmed) {
                            await updateBuilding({ isDeleted: true }, selectedBuildingId);
                            setFetch(!fetch);
                        }
                        setDeleteModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
