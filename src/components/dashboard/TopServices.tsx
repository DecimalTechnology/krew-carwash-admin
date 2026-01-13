import { useEffect, useState } from "react";
import { getTopServices } from "../../api/admin/dashboardService";
import { TrendingUp, Users } from "lucide-react";

function TopServices() {
    const [data, setData] = useState<any[]>([]);
   
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTopServices();
                console.log(res?.data)
                setData(Array.isArray(res?.data) ? res?.data : []);
            } catch (err) {
                console.error("Error fetching top services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

  

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Top Services</h3>
            </div>

            <div className="space-y-3">
                {data?.map((service, index) => (
                    <div key={service._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-bold">{index + 1}</div>
                            <div>
                                <h4 className="font-medium text-gray-900">{service?.package?.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Users className="w-3 h-3" />
                                    {service.totalBookings || 0} bookings
                                </div>
                            </div>
                        </div>
                        <div className="text-right">{service.frequency && <span className="text-sm text-gray-600">{service.frequency}</span>}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopServices;
