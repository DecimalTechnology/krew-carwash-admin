import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockuser, deleteUser, getAllUser, toggleUserStatus } from "../api/userService";
import toast from "react-hot-toast";

export const useGetUsers = (params: any) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getAllUser(params),
    });
};

export const useToggleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => toggleUserStatus(userId),
        onSuccess: (data) => {
            const userId = data?.data?._id;
            console.log(userId);
            toast.success("Status Updated successfully ✅");

            queryClient.setQueriesData(["users"], (oldData: any) => {
                const users = oldData?.data?.users;
                if (!users) return oldData;

                const updatedUsers = users?.map((obj: any) => (obj?._id == userId ? { ...obj, isActive: !obj?.isActive } : obj));

                return {
                    ...oldData,
                    data: {
                        ...oldData?.data,
                        users: updatedUsers,
                    },
                };
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to toggle status ❌");
        },
    });
};

export const useToggleBlockStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => blockuser(userId),

        onSuccess: (data) => {
            const userId = data?.data?._id;
            toast.success("Status Updated successfully ✅");

            queryClient.setQueriesData(["users"], (oldData: any) => {
                const users = oldData?.data?.users;
                if (!users) return oldData;

                const updatedUsers = users.map((obj: any) =>
                    obj?.userId === userId || obj?._id === userId ? { ...obj, isBlocked: !obj?.isBlocked } : obj
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        users: updatedUsers,
                    },
                };
            });
        },

        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to toggle status ❌");
        },
    });
};
export const userUserDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),

        onSuccess: (data) => {
            const userId = data?.data?._id;
            toast.success("Status deleted successfully ✅");

            queryClient.setQueriesData(["users"], (oldData: any) => {
                const users = oldData?.data?.users;
                if (!users) return oldData;

                const updatedUsers = users.filter((obj: any) =>obj?._id!==userId
                   
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        users: updatedUsers,
                    },
                };
            });
        },

        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to toggle status ❌");
        },
    });
};
