import {
    fetchExportToExcel,
    fetchFilteredUsers,
    fetchRoles,
    fetchStackholders,
} from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UserFilterParams {
    search?: string;
    role?: number;
    stackholder?: number;
    date?: string;
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

export const useExportToExcel = (filters: UserFilterParams) => {
    console.log("Filters", filters);
    return useMutation({
        mutationFn: async () => {
            const data = await fetchExportToExcel(filters);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "users_export.xlsx"); // Nom du fichier à télécharger
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });
};
