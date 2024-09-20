import {
    RiskITForm,
    RitFetchFilters,
} from "@/presentation/pages/dashboard/RiskIt/types";
import { fetchCategory } from "@/services/riaService";
import {
    fetchExportToExcelRIT,
    fetchFilteredRit,
    fetchHistoryRit,
    updateRit,
} from "@/services/ritService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchFilteredRIT = (filters: RitFetchFilters) => {
    console.log(filters);
    return useQuery({
        queryKey: ["rit", filters],
        queryFn: () => fetchFilteredRit(filters),
    });
};

export const useFetchCategory = () => {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => fetchCategory(),
    });
};

export const useExportToExcelRit = (filters: RitFetchFilters) => {
    return useMutation({
        mutationFn: async () => {
            const data = await fetchExportToExcelRIT(filters);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "rit_exports.xlsx"); // Nom du fichier à télécharger
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });
};

export const useUpdateResourceRIT = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id?: string | number; data: RiskITForm }) =>
            updateRit(params.id as number, params.data),

        onSuccess: (data) => {
            queryClient.invalidateQueries();
            console.log("User updated successfully", data);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.error("Erreur lors de la mise à jour:", error.message);
        },
    });
};

export const useFetchRitHistory = (id?: number) => {
    return useQuery({
        queryKey: ["history_it", id],
        queryFn: () => fetchHistoryRit(id),
    });
};
