/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const createCleaner = async (formData: any) => {
    try {
        const result = await baseUrl.post("/admin/cleaners", formData);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getAllCleaners = async (params: any) => {
    try {
        const result = await baseUrl.get("/admin/cleaners", { params: params });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const updateCleaner = async (data: Record<string, any>, cleanerId: string) => {
    try {
        const result = await baseUrl.put(`/admin/cleaners/${cleanerId}`, data);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const deleteCleaner = async (cleanerId: string) => {
    try {
        const result = await baseUrl.delete(`/admin/cleaners/${cleanerId}`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const getPassword = async (cleanerId: string) => {
    try {
        const result = await baseUrl.get(`/admin/cleaners/${cleanerId}/password`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};


export const getCleanersList = async () => {
    try {
        const result = await baseUrl.get(`/admin/cleaners/list`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const assignCleaner = async (cleanerId:string,bookingId:string) => {
    try {
        const result = await baseUrl.patch(`/admin/cleaners/assign`,{cleanerId,bookingId});
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
