import { apiClient } from "@/api/apiClient";
import { UserFormFields } from "@/presentation/pages/dashboard/Admin/components/userDialog";

interface UserFilterParams {
    search?: string;
    role?: number;
    stackholder?: number;
    date?: string;
}

interface PatchUserStateParams {
    userId: number;
    isActive: boolean;
}

export const fetchFilteredUsers = async (filters: UserFilterParams) => {
    const { search = "", role = null, stackholder = null, date = "" } = filters;
    const response = await apiClient.get(`/api/v1/users/`, {
        params: { search, stackholder, role, date },
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

export const fetchExportToExcel = async (filters: UserFilterParams) => {
    const { search = "", role = null, stackholder = null, date = "" } = filters;
    const response = await apiClient.get(`/api/v1/users/export_to_excel/`, {
        responseType: "blob",
        params: { search, stackholder, role, date },
    });
    return response.data;
};

export const createUser = async (userData: UserFormFields) => {
    const response = await apiClient.post(`/api/v1/users/`, {
        ...userData,
        password:""
    });
    return response.data;
};

export const updateUser = async (
    userId: number | undefined,
    userData: UserFormFields
) => {
    if (userId === undefined) {
        throw new Error("User ID is required to update user");
    }

    try {
        const response = await apiClient.put(
            `/api/v1/users/${userId}`,
            userData
        );
        return response.data;
    } catch (error) {
        console.error(
            "Erreur lors de la mise à jour de l'utilisateur :",
            error
        );
        throw error;
    }
};

// Gérer les erreurs de l'API
export const updateResource = async (
    id: number | undefined,
    data: UserFormFields
) => {
    try {
        const response = await apiClient.put(`/api/v1/users/${id}/`, data);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Renvoyer une erreur détaillée
        if (error.response) {
            // Erreur côté serveur
            throw new Error(error.response.data.message || "Erreur serveur");
        } else {
            // Erreur réseau ou autre
            throw new Error(
                "Une erreur est survenue. Veuillez vérifier votre connexion."
            );
        }
    }
};
