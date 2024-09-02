import {
    fetchFilteredUsers,
    fetchRoles,
    fetchStackholders,
} from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

interface UserFilterParams {
    search?: string;
    role?: number;
    stackholder?: number;
}

export const useFilteredUsers = (filters: UserFilterParams) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => fetchFilteredUsers(filters),
    });
};

export const useFetchRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => fetchRoles(),
    });
};

export const useFetchStackholder = () => {
    return useQuery({
        queryKey: ["stackholder"],
        queryFn: () => fetchStackholders(),
    });
};
