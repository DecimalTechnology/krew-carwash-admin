/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getChats = async (filter:any) => {
    try {
        const result = await baseUrl.get("/admin/chats",{params:filter});
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getMessages = async (chatId:string) => {
    try {
        const result = await baseUrl.get(`/admin/chats/${chatId}/messages`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const resolveIssue = async (chatId:string) => {
    try {
        const result = await baseUrl.patch(`/admin/chats/${chatId}/close`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getUnresolvedReportCount = async () => {
    try {
        const result = await baseUrl.get(`/admin/chats/reports/unresolved-count`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
