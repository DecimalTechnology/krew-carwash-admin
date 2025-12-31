/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

 export const  BACKEND_URL = 'http://15.206.195.131:5000'
// export const  BACKEND_URL = 'http://localhost:5000'
export const BASE_URL  = `${BACKEND_URL}/api/v1`;

// export const BASE_URL = `https://krew-car-wash-server.onrender.com/api/v1`;

export const baseUrl = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

console.log(BASE_URL)

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor to add auth token
baseUrl.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("krew_adminAccessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling unauthorized errors and token refresh
baseUrl.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return baseUrl(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("krew_adminRefreshToken");

            if (!refreshToken) {
                // No refresh token available - redirect to login
                localStorage.removeItem("krew_adminAccessToken");
                localStorage.removeItem("krew_adminRefreshToken");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                // Call refresh token endpoint
                const { data } = await axios.post(`${BASE_URL}/admin/refresh-token`, { refreshToken });

                // Store new access token
                const newAccessToken = data.accessToken;
                localStorage.setItem("krew_adminAccessToken", newAccessToken);

                // Update authorization header
                baseUrl.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process queued requests
                processQueue(null, newAccessToken);
                isRefreshing = false;

                // Retry original request with new token
                return baseUrl(originalRequest);
            } catch (refreshError) {
                // Refresh token failed - clear tokens and redirect to login
                processQueue(refreshError, null);
                isRefreshing = false;

                localStorage.removeItem("krew_adminAccessToken");
                localStorage.removeItem("krew_adminRefreshToken");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const errorHandler = (error: any) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError?.response?.data?.message) {
            return axiosError?.response?.data?.message;
        }
    }

    return "Internal Server Error";
};
