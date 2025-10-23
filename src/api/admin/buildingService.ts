import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "../baseUrl";

export const createBuilding = async (formData: any) => {
    try {
        const result = await baseUrl.post("/admin/building", formData,{headers:{"Content-Type":"multipart/form-data"}});
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getAllBuildings = async (params: any) => {
    try {
        const result = await baseUrl.get("/admin/buildings", { params: params });
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const updateBuilding = async (data: Record<string, any>, buildingId: string) => {
    try {
        const result = await baseUrl.put(`/admin/buildings/${buildingId}`,  data );
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
