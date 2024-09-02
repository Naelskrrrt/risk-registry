import { apiClient } from "@/api/apiClient";

interface UserFilterParams {
    search?: string;
    role?: number;
    stackholder?: number;
}

interface PatchUserStateParams {
    userId: number;
    isActive: boolean;
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

export const patchUserState = async ({
    userId,
    isActive,
}: PatchUserStateParams) => {
    const response = await apiClient.patch(
        `/api/v1/users/${userId}/user_state/`,
        {
            is_active: isActive,
        }
    );
    return response.data;
};
