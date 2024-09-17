import { Risk } from "@/presentation/pages/dashboard/Admin/constant/constant";
import {
    fetchAffectedArea,
    fetchCategory,
    fetchExportToExcelRIA,
    fetchFilteredRIA,
    fetchProcess,
    fetchRiskType,
    fetchSubprocess,
    updateRia,
} from "@/services/riaService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface RIAFetchFilters {
    search?: string;
    date?: string;
    process?: number;
    subprocess?: number;
    stackholder?: number;
    inherent_risk_level?: string;
}

export const useFilteredRIA = (filters: RIAFetchFilters) => {
    return useQuery({
        queryKey: ["ria", filters],
        queryFn: () => fetchFilteredRIA(filters),
    });
};

export const useFetchProcess = () => {
    return useQuery({
        queryKey: ["process"],
        queryFn: () => fetchProcess(),
    });
};

export const useFetchSubprocess = (process_id?: number) => {
    return useQuery({
        queryKey: ["subprocess"],
        queryFn: () => fetchSubprocess(process_id),
    });
};

export const useExportToExcelRIA = (filters: RIAFetchFilters) => {
    return useMutation({
        mutationFn: async () => {
            const data = await fetchExportToExcelRIA(filters);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ria_exports.xlsx"); // Nom du fichier à télécharger
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });
};

export const useFetchRiskType = () => {
    return useQuery({
        queryKey: ["risk_type"],
        queryFn: () => fetchRiskType(),
    });
};

export const useFetchAffectedArea = () => {
    return useQuery({
        queryKey: ["affected_area"],
        queryFn: () => fetchAffectedArea(),
    });
};

export const useFetchCategory = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategory(),
    });
};

export const useUpdateResource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id: number | undefined; data: Risk }) =>
            updateRia(params.id, params.data),

        onSuccess: (data) => {
            queryClient.invalidateQueries(); // Invalider les requêtes pour rafraîchir les données après la création
            console.log("User updated successfully", data);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            console.error("Erreur lors de la mise à jour:", error.message);
        },
    });
};
