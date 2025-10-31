/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { baseUrl, errorHandler } from "../baseUrl";

// GET /admin/packages - Get all packages with query params
export const getAllPackages = async (params?: {
  search?: string;
  status?: string;
  sortedBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const result = await baseUrl.get("/admin/packages", { params });
    console.log("Packages API Response:", result?.data);
    return result?.data;
  } catch (error: any) {
    const message = errorHandler(error);
    console.error("Packages API Error:", error?.response?.status, message);
    
    // Check if it's a 404 error
    if (error?.response?.status === 404) {
      toast.error("Packages API endpoint not found. Please check your backend routes.");
    } else {
      toast.error(message);
    }
    throw new Error(message);
  }
};

// POST /admin/packages - Create a new package
export const createPackage = async (data: any) => {
  try {
    const result = await baseUrl.post("/admin/packages", data);
    console.log("Create Package Response:", result?.data);
    return result?.data;
  } catch (error: any) {
    const message = errorHandler(error);
    console.error("Create Package Error:", error?.response?.status, message);
    
    // Check if it's a 404 error
    if (error?.response?.status === 404) {
      toast.error("Packages API endpoint not found. Please check your backend routes.");
    } else {
      toast.error(message);
    }
    throw new Error(message);
  }
};

// PUT /admin/packages/:packageId - Update a package
export const updatePackage = async (packageId: string, data: any) => {
  try {
    const result = await baseUrl.put(`/admin/packages/${packageId}`, data);
    console.log("Update Package Response:", result?.data);
    return result?.data;
  } catch (error: any) {
    const message = errorHandler(error);
    console.error("Update Package Error:", error?.response?.status, message);
    
    // Check if it's a 404 error
    if (error?.response?.status === 404) {
      toast.error("Package not found or API endpoint not available.");
    } else {
      toast.error(message);
    }
    throw new Error(message);
  }
};

// DELETE /admin/packages/:packageId - Delete a package
export const deletePackage = async (packageId: string) => {
  try {
    const result = await baseUrl.delete(`/admin/packages/${packageId}`);
    console.log("Delete Package Response:", result?.data);
    return result?.data;
  } catch (error: any) {
    const message = errorHandler(error);
    console.error("Delete Package Error:", error?.response?.status, message);
    
    // Check if it's a 404 error
    if (error?.response?.status === 404) {
      toast.error("Package not found or API endpoint not available.");
    } else {
      toast.error(message);
    }
    throw new Error(message);
  }
};

