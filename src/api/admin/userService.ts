/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getAllUsers = async (params: any) => {
    try {
        const result = await baseUrl.get("/admin/users", { params: params });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const updateUser = async (payload: Record<string,any>,userId:string) => {
    try {
        const result = await baseUrl.put(`/admin/users/${userId}`,payload);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

