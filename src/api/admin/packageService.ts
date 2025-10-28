import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "../baseUrl";

export const getPackages = async () => {
    try {
        const result = await baseUrl.get("/admin/packages");
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
    }
};