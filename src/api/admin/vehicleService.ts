import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "../baseUrl";

export const getAllVehicles = async () => {
    try {
        const result = await baseUrl.get("/admin/vehicles");
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
    }
};
export const changeStatus = async (vehicleId:string,data:any) => {
    try {
        const result = await baseUrl.put(`/admin/vehicles/${vehicleId}`,data);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
    }
};
export const updateVehicle = async (vehicleId:string,data:any) => {
    try {
        const result = await baseUrl.put(`/admin/vehicles/${vehicleId}`,data,{headers:{"Content-Type":"multipart/form-data"}});
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
    }
};