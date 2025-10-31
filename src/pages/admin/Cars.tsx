import { useEffect, useState } from "react";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import { changeStatus, getAllVehicles, updateVehicle, deleteVehicle as deleteVehicleApi } from "../../api/admin/vehicleService";
import { IVehicle } from "../../interface/IVehicle";
import Switch from "../../components/ui/switch/Switch";
import { Edit, Trash2 } from "lucide-react";
import VehicleEditModal from "../../components/vehicle/VehicleEditModal";
import DeleteModal from "../../components/ui/modals/common/DeleteModal";

function Cars() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllVehicles();
                if (res?.data) {
                    setVehicles(res.data);
                }
            } catch (err) {
                setError("Failed to fetch vehicles");
                console.error("Error fetching vehicles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteVehicle = async (vehicleId: string) => {
        const res = await deleteVehicleApi(vehicleId);
        if (res?.success) {
            setVehicles(vehicles.filter((vehicle: IVehicle) => vehicle._id !== vehicleId));
        }
    };

    const changeVehicleStatus = async (vehicleId: string, status: boolean) => {
        const res = await changeStatus(vehicleId, { isActive: status });
        if (res?.data) {
            setVehicles(vehicles.map((obj: IVehicle) => (obj?._id == vehicleId ? res?.data : obj)));
        }
    };

    const update = async (id: string, data: FormData) => {
        const res = await updateVehicle(id, data);
        if(res?.success){
            setVehicles(vehicles.map((obj: IVehicle) => (obj?._id == id ? res?.data : obj)));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-lg">Loading vehicles...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb
                pageName="Cars"
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Cars", path: "/cars" },
                ]}
            />

            {/* Vehicles List */}
            <div className="mt-8">
               

                {vehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No vehicles found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] ${!vehicle.isActive ? "opacity-60" : ""}`}
                            >
                                {/* Vehicle Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    {vehicle.image ? (
                                        <img 
                                            src={vehicle.image} 
                                            alt={vehicle.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-600">
                                            <span className="text-6xl font-bold text-white uppercase">
                                                {vehicle.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            vehicle.isActive 
                                                ? "bg-green-500 text-white" 
                                                : "bg-gray-500 text-white"
                                        }`}>
                                            {vehicle.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h3>
                                    </div>

                                    {vehicle.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                                            {vehicle.description}
                                        </p>
                                    )}

                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <span>Created: {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                                        <span>Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {/* Status Toggle */}
                                        <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Status:</span>
                                            <Switch
                                                checked={vehicle?.isActive}
                                                onChange={(checked: boolean) => changeVehicleStatus(vehicle?._id, checked)}
                                            />
                                        </div>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedVehicle(vehicle);
                                                setIsOpen(true);
                                            }}
                                            className="p-2.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                                            title="Edit Vehicle Type"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedVehicleId(vehicle._id);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-2.5 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                                            title="Delete Vehicle Type"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <VehicleEditModal
                isOpen={isOpen}
                vehicle={selectedVehicle}
                onClose={() => setIsOpen(false)}
                onSave={(formData: FormData) => {
                    if (selectedVehicle?._id) {
                        update(selectedVehicle._id, formData);
                    }
                }}
            />

            {/* Delete Modal */}
            {deleteModalOpen && (
                <DeleteModal
                    handleDelete={async(confirm: boolean) => {
                        if (confirm) {
                            await handleDeleteVehicle(selectedVehicleId);
                        }
                        setDeleteModalOpen(false);
                    }}
                    isOpen={deleteModalOpen}
                    type="Vehicle Type"
                />
            )}
        </div>
    );
}

export default Cars;

