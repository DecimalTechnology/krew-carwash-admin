/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getAllVehicles = async () => {
    try {
        const result = await baseUrl.get("/admin/vehicle-types");
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const changeStatus = async (vehicleId:string,data:any) => {
    try {
        const result = await baseUrl.put(`/admin/vehicles-types/${vehicleId}`,data);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const updateVehicle = async (vehicleId:string,data:any) => {
    try {
        const result = await baseUrl.put(`/admin/vehicles-types/${vehicleId}`,data,{headers:{"Content-Type":"multipart/form-data"}});
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const deleteVehicle = async (vehicleId:string) => {
    try {
        const result = await baseUrl.delete(`/admin/vehicles/${vehicleId}`);
        toast.success("Vehicle deleted successfully");
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};