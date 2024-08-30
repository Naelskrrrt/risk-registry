import { apiClient } from "@/api/apiClient";

interface UserFilterParams {
    search?: string;
    role?: number;
    stackholder?: number;
}

export const fetchFilteredUsers = async (filters: UserFilterParams) => {
    const { search = "", role = null, stackholder = null } = filters;
    const response = await apiClient.get(`/api/v1/users/`, {
        params: { search, stackholder, role },
    });

    return response.data;
};

export const fetchRoles = async () => {
    const response = await apiClient.get(`/api/v1/roles/`);

    return response.data;
};

export const fetchStackholders = async () => {
    const response = await apiClient.get(`/api/v1/stackholders/`);
    return response.data;
};
