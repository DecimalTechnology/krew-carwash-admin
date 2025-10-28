import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Eye, Trash } from "lucide-react";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import SearchBox from "../../components/ui/SearchBox";
import TableLoading from "../../components/ui/table/TableLoading";

import Switch from "../../components/ui/switch/Switch";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";
import toast from "react-hot-toast";
import { getAllUsers, updateUser } from "../../api/admin/userService";
import { IUser } from "../../interface/IUser";
import Pagination from "../../components/ui/pagination/Pagination";
import UserViewModal from "../../components/users/UserViewModal";


export default function Users() {
    // Static UI state only
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [fetch,setFetch]=  useState(false);
    const [userViewModalOpen,setUserViewModalOpen] = useState(false);
    const [selectedUser,setSelectedUser] = useState<IUser|{}>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllUsers({ search, status: statusFilter, sortedBy: sortKey, sortOrder, page });
                setLoading(false);
                setUsers(res?.data);
                setTotalPages(res?.data?.pagination?.totalPages);
            } catch (error) {
                toast.error(error as string);
            }
        };

        fetchData();
    }, [search, statusFilter, sortKey, limit, sortOrder, page,fetch]);

    const handleUpdate = async (payload: any, userId: string) => {
        const result = await updateUser(payload, userId);
        const newUser = result?.data;

        setUsers((prev: IUser[]) => prev.map((obj: IUser) => (obj?._id === userId ? newUser : obj)));
    };

    return (
        <div className="space-y-4">
            <Breadcrumb
                pageName="Users"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Users", path: "/users" },
                ]}
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-4">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                        {/* Left side tabs */}
                        <div className="flex flex-wrap gap-2 md:flex-1">
                            {["All", "Active", "Inactive"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setStatusFilter(tab.toLowerCase())}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        statusFilter === tab.toLowerCase()
                                            ? "bg-gradient-to-r from-[#4a9d91] to-[#6ECFC3] text-white"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
                            {/* Sort key dropdown */}
                            <select
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="h-10 border rounded px-3 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="name">Name</option>
                                <option value="createdAt">Date</option>
                            </select>

                            {/* Sort order toggle */}
                            <button
                                type="button"
                                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                                className="h-10 border rounded px-3 flex items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                                title={sortOrder === "asc" ? "Ascending" : "Descending"}
                            >
                                {sortOrder === "asc" ? "▲" : "▼"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                    {loading ? (
                        <TableLoading />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        No
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Name
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Email
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Phone
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Image
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Verification Method
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Active
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Created At
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Updated At
                                    </TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {users?.map((data: IUser, index: number) => (
                                    <TableRow key={String(data?._id)}>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {data?.name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {data.email}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data?.phone)}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <img src={data?.image || "no-profile.jpg"} alt="user" className="w-10 h-10 rounded-full object-cover" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data?.verificationMethod)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={data?.isActive}
                                                    onChange={() => handleUpdate({ isActive: !data?.isActive }, data?._id)}
                                                    size="sm"
                                                    color="success"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {new Date(data.updatedAt).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <button
                                                onClick={() => {
                                                    setSelectedUserId(data?._id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash size={18} className="ml-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(data)
                                                    setUserViewModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-red-700"
                                            >
                                                <Eye size={18} className="ml-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(page: number) => setPage(page)} />
            </div>
            {deleteModalOpen && (
                <DeleteModal
                    handleDelete={async(arg: boolean) => {
                        if (arg) {
                            
                            setDeleteModalOpen(false);
                           await  updateUser({isDeleted:true},selectedUserId)
                            setFetch(!fetch)
                        } else {
                            setDeleteModalOpen(false);
                        }
                    }}
                    isOpen={deleteModalOpen}
                    type={"User"}
                />
            )}

            {userViewModalOpen&&<UserViewModal onClose={()=>setUserViewModalOpen(false)} user={selectedUser}/>}
        </div>
    );
}
