/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl, errorHandler } from "../baseUrl";
import toast from "react-hot-toast";

export const getAdminDashboard = async (
  params: Record<string, any> = {}
) => {
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
