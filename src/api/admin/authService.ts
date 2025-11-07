/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";
import { store } from "../../app/store";
import { setAdminData, clearAdminData } from "../../features/adminSlice";

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
        
        // Store tokens in localStorage (tokens only)
        if (result?.data?.accessToken) {
            localStorage.setItem("krew_adminAccessToken", result.data.accessToken);
        }
        if (result?.data?.refreshToken) {
            localStorage.setItem("krew_adminRefreshToken", result.data.refreshToken);
        }
        
        // Store admin data in Redux instead of localStorage
        if (result?.data?.data) {
            store.dispatch(setAdminData(result.data.data));
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
    // Remove tokens from localStorage
    localStorage.removeItem("krew_adminAccessToken");
    localStorage.removeItem("krew_adminRefreshToken");
    
    // Clear admin data from Redux
    store.dispatch(clearAdminData());
    
    toast.success("Logged out successfully");
};

export const isAuthenticated = (): boolean => {
    // Check if either access token or refresh token exists
    // If refresh token exists, we can get a new access token
    const accessToken = localStorage.getItem("krew_adminAccessToken");
    const refreshToken = localStorage.getItem("krew_adminRefreshToken");
    return !!(accessToken || refreshToken);
};

