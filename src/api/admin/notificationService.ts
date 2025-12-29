/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export const getNotificationTypes = async () => {
    try {
        const result = await baseUrl.get("/admin/notifications/types");
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getAllNotifications = async (params:any) => {
    try {
        const result = await baseUrl.get("/admin/notifications",{params:params});
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const markRead = async (notificationId:string) => {
    try {
        const result = await baseUrl.patch(`/admin/notifications/${notificationId}/read`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const getUnreadNotificationsCount = async () => {
    try {
        const result = await baseUrl.get(`/admin/notifications/unread`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
export const markAllAsReadNotification = async () => {
    try {
        const result = await baseUrl.patch(`/admin/notifications/read`);
        return result?.data;
    } catch (error) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};
