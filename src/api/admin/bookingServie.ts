/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getAllBooking = async (filter: any) => {
    try {
        const result = await baseUrl.get("/admin/bookings", { params: filter });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getBooking = async (bookingId: string) => {
    try {
        const result = await baseUrl.get(`/admin/bookings/${bookingId}`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};

export const assignCleaner = async (cleanerId: string, bookingId: string) => {
    try {
        const result = await baseUrl.patch(`/admin/bookings/cleaners/assign`, { cleanerId, bookingId });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const unAssignCleaner = async (cleanerId: string, bookingId: string) => {
    try {
        const result = await baseUrl.patch(`/admin/bookings/cleaners/unassign`, { cleanerId, bookingId });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const getCleanersList = async () => {
    try {
        const result = await baseUrl.get(`/admin/bookings/cleaners`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const getSessionImages = async (sessionId: string, sessionType: string, bookingId: string,addonId:string) => {
    try {
     
        const result = await baseUrl.get(`/admin/bookings/sessions/images`, { params: { sessionId, sessionType, bookingId,addonId } });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const deleteBooking = async (bookingId:string) => {
    try {
     
        const result = await baseUrl.delete(`/admin/bookings/${bookingId}`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};


