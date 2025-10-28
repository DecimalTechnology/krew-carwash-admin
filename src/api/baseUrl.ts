import axios from "axios";

export const BASE_URL = `http://localhost:5000/api/v1`;

export const baseUrl = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
baseUrl.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling unauthorized errors
baseUrl.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem("adminToken");
            // You can redirect to login page here if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const erroHandler = (error: any) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError?.response?.data?.message) {
            return axiosError?.response?.data?.message
        }
    }

    return "An unexpected error occurred"
};
