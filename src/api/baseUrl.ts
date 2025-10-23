import axios from "axios";

export const BASE_URL = `http://localhost:5000/api/v1`;

export const baseUrl = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const erroHandler = (error: any) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError?.response?.data?.message) {
            return axiosError?.response?.data?.message
        }
    }

    return "An enexpected error occured"
};
