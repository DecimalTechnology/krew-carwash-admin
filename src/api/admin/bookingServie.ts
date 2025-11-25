/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getAllBooking = async (filter:any) => {
    try {
        const result = await baseUrl.get("/admin/bookings",{params:filter});
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getBooking = async (bookingId:string) => {
    try {
        const result = await baseUrl.get(`/admin/bookings/${bookingId}`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
