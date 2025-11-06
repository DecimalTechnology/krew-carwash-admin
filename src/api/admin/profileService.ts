/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";
import { AdminData } from "../../features/adminSlice";

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    phone?: number;
    image?: string;
}

export interface ProfileResponse {
    success: boolean;
    data: AdminData;
    message: string;
}

export const getAdminProfile = async (): Promise<ProfileResponse> => {
    try {
        const result = await baseUrl.get("/admin/profile");
        return result?.data;
    } catch (error: any) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};

export const updateAdminProfile = async (payload: UpdateProfilePayload | FormData): Promise<ProfileResponse> => {
    try {
        // Determine if we're sending FormData (with file) or JSON
        const config = payload instanceof FormData 
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : {};

        const result = await baseUrl.put("/admin/profile", payload, config);
        toast.success(result?.data?.message || "Profile updated successfully!");
        return result?.data;
    } catch (error: any) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};

