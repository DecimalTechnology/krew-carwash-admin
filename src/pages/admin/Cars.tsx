import { useEffect, useState } from "react";
import Breadcrumb from "../../components/brudcrump/Breadcrumb";
import { changeStatus, getAllVehicles, updateVehicle } from "../../api/admin/vehicleService";
import { IVehicle } from "../../interface/IVehicle";
import Switch from "../../components/ui/switch/Switch";
import { Edit } from "lucide-react";
import VehicleEditModal from "../../components/vehicle/VehicleEditModal";

function Cars() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<IVehicle>({});

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

    const deleteVehicle = (vehicleId: string) => {};

    const changeVehicleStatus = async (vehicleId: string, status: boolean) => {
        const res = await changeStatus(vehicleId, { isActive: status });
        setVehicles(vehicles.map((obj: any) => (obj?._id == vehicleId ? res?.data : obj)));
    };

    const update = async (id: string, data: IVehicle) => {
        const res = await updateVehicle(id, data);
        if(res?.success){
            setVehicles(vehicles.map((obj: any) => (obj?._id == id ? res?.data : obj)));
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
                    <div className="text-center py-8">
                        <p className="text-gray-500">No vehicles found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden border ${!vehicle.isActive ? "opacity-60" : ""}`}
                            >
                                {/* Vehicle Image */}
                                {vehicle.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Vehicle Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">{vehicle.name}</h3>

                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={vehicle?.isActive}
                                                onChange={(checked: boolean) => changeVehicleStatus(vehicle?._id, checked)}
                                            />
                                            <Edit
                                                className="text-blue-500 cursor-pointer hover:text-red-700"
                                                size={20}
                                                onClick={() => {
                                                    setSelectedVehicle(vehicle);
                                                    setIsOpen(true);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {vehicle.description && <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>}

                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Created: {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                                        <span>Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Table View Alternative */}
            <VehicleEditModal
                isOpen={isOpen}
                vehicle={selectedVehicle}
                onClose={() => setIsOpen(false)}
                onSave={(updatedVehicle: IVehicle) => {
                    update(selectedVehicle?._id, updatedVehicle);
                }}
            />
        </div>
    );
}

export default Cars;
