/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    data: {
        _id: string;
        email: string;
        name: string;
        phone: number;
        role: string;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
    };
    message: string;
}

export const adminLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const result = await baseUrl.post("/admin/login", credentials);
        
        if (result?.data?.accessToken) {
            localStorage.setItem("adminToken", result.data.accessToken);
        }
        if (result?.data?.refreshToken) {
            localStorage.setItem("adminRefreshToken", result.data.refreshToken);
        }
        if (result?.data?.data) {
            localStorage.setItem("adminData", JSON.stringify(result.data.data));
        }
        
        toast.success(result?.data?.message || "Login successful!");
        return result?.data;
    } catch (error: any) {
        const message = errorHandler(error);
        toast.error(message);
        throw new Error(message);
    }
};

export const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("adminToken");
};

export const getAdminData = () => {
    const adminDataString = localStorage.getItem("adminData");
    if (adminDataString) {
        try {
            return JSON.parse(adminDataString);
        } catch (error) {
            console.error("Error parsing admin data:", error);
            return null;
        }
    }
    return null;
};

