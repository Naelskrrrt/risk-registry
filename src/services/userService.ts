import { apiClient } from "@/api/apiClient";

interface UserFilterParams {
    search?: string;
    role?: string;
    stackholder?: string;
}

export const fetchFilteredUsers = async (filters: UserFilterParams) => {
    const { search = "", role = "", stackholder = "" } = filters;
    const response = await apiClient.get(`/api/v1/users/`, {
        params: { search, role, stackholder },
    });

    return response.data;
};
