import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Eye, Trash, Edit } from "lucide-react";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import SearchBox from "../../components/ui/SearchBox";
import TableLoading from "../../components/ui/table/TableLoading";
import Switch from "../../components/ui/switch/Switch";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";
import toast from "react-hot-toast";
import Pagination from "../../components/ui/pagination/Pagination";
import Badge from "../../components/ui/badge/Badge";

import AddPackageModal from "../../components/package/AddPackageModal";
import EditPackageModal from "../../components/package/EditPackageModal";
import ViewPackageModal from "../../components/package/ViewPackageModal";

import { getAllPackages, updatePackage } from "../../api/admin/packageService";
import { IPackage } from "../../interface/IPackage";

export default function Packages() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [fetch, setFetch] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllPackages({
          search,
          status: statusFilter,
          sortedBy: sortKey,
          sortOrder,
          page,
          limit,
        });
        
        // Handle different response structures
        if (Array.isArray(res?.data)) {
          setPackages(res.data);
        } else if (Array.isArray(res)) {
          setPackages(res);
        } else {
          setPackages([]);
        }
        
        setTotalPages(res?.data?.pagination?.totalPages || res?.pagination?.totalPages || 1);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setPackages([]);
        console.error("Error fetching packages:", error);
        // Error already handled by service with toast
      }
    };
    fetchData();
  }, [search, statusFilter, sortKey, sortOrder, page, limit, fetch]);

  const handleUpdate = async (payload: any, packageId: string) => {
    try {
      const res = await updatePackage(packageId, payload);
      const updatedPackage = res?.data || res;
      setPackages((prev) => prev.map((p) => (p._id === packageId ? updatedPackage : p)));
      toast.success("Package updated successfully");
    } catch (err: any) {
      console.error("Error updating package:", err);
      // Error already handled by service with toast
    }
  };

  const handleEditUpdate = (updatedPackage: IPackage) => {
    setPackages((prev) => prev.map((p) => (p._id === updatedPackage._id ? updatedPackage : p)));
  };

  return (
    <div className="space-y-4">
      <Breadcrumb
        pageName="Packages"
        elements={[
          { page: "Home", path: "/" },
          { page: "Packages", path: "/packages" },
        ]}
      />

      <div className="w-full flex flex-wrap justify-between items-center gap-4 mt-4">
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

        <SearchBox search={search} setSearch={setSearch} className="h-10 w-48" />

        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add New Package
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
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    No
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Name
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Frequency
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Description
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Pricing
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Active
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Created At
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg, index) => (
                  <TableRow key={pkg._id}>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {pkg.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      <Badge color="info" variant="light" size="sm">
                        {pkg.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      <div className="max-w-xs truncate">{pkg.description || "-"}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {pkg.basePrices && pkg.basePrices.length > 0 ? (
                        <div className="space-y-1">
                          {pkg.basePrices.map((bp, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center justify-between gap-2 px-2 py-1 bg-brand-50 dark:bg-brand-500/10 rounded border border-brand-100 dark:border-brand-500/20 hover:border-brand-300 dark:hover:border-brand-500/40 transition-all"
                            >
                              <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                {typeof bp.vehicleType === 'object' ? bp.vehicleType.name : 'N/A'}
                              </span>
                              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                                {bp.price.toFixed(0)} AED
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      <Switch
                        checked={pkg.isActive}
                        onChange={() => handleUpdate({ isActive: !pkg.isActive }, pkg._id)}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setViewModalOpen(true);
                          }}
                          className="p-2 text-[#5DB7AE] hover:text-[#4a9d91] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setEditModalOpen(true);
                          }}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPackageId(pkg._id);
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

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {addModalOpen && (
        <AddPackageModal
          onClose={() => setAddModalOpen(false)}
          isOpen={addModalOpen}
          onSuccess={() => setFetch(!fetch)}
        />
      )}

      {editModalOpen && selectedPackage && (
        <EditPackageModal
          package={selectedPackage}
          onClose={() => setEditModalOpen(false)}
          isOpen={editModalOpen}
          onUpdate={handleEditUpdate}
        />
      )}

      {viewModalOpen && selectedPackage && (
        <ViewPackageModal package={selectedPackage} onClose={() => setViewModalOpen(false)} />
      )}

      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          type="Package"
          handleDelete={async (confirmed: boolean) => {
            if (confirmed) {
              await updatePackage(selectedPackageId, { isDeleted: true });
              setFetch(!fetch);
              toast.success("Package deleted successfully");
            }
            setDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

