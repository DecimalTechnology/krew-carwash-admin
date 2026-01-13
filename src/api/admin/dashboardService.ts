/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl, errorHandler } from "../baseUrl";
import toast from "react-hot-toast";

export const getAdminDashboard = async (params: Record<string, any> = {}) => {
    try {
        const response = await baseUrl.get("/admin/dashboard", { params });

        console.log("Dashboard API Response:", response?.data);
        return response?.data?.data ?? response?.data;
    } catch (error: any) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};

export const getOverview = async (fromDate: string, toDate: string, filter: string) => {
    try {
        const result = await baseUrl.get(`/admin/dashboard/overview`, { params: { fromDate, toDate, filter } });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const getBookings = async (fromDate: string, toDate: string, filter: string,packageId:string,buildingId:string,cleanerId:string) => {
    try {
        const result = await baseUrl.get(`/admin/dashboard/bookings`, { params: { fromDate, toDate, filter,packageId ,buildingId,cleanerId} });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const getRecentBookings = async (fromDate: string, toDate: string, filter: string) => {
    try {
        const result = await baseUrl.get(`/admin/dashboard/recent-bookings`, { params: { fromDate, toDate, filter } });
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
export const getTopCleaners = async () => {
    try {
        const result = await baseUrl.get(`/admin/dashboard/top-cleaners`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};

export const getMonthlySales = async (year?: number) => {
    try {
        const response = await baseUrl.get(`/admin/dashboard/monthly-sales?year=${year}`);
        return response.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};


export const getTopServices = async () => {
    try {
        const response = await baseUrl.get(`/admin/dashboard/top-services`);
        return response.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
    }
};
