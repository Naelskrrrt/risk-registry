import { fetchFilteredUsers } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

interface UserFilterParams {
    search?: string;
    role?: string;
    stackholder?: string;
}

export const useFilteredUsers = (filters: UserFilterParams) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => fetchFilteredUsers(filters),
    });
};
