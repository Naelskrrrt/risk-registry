import { fetchFilteredRIA } from "@/services/riaService";
import { useQuery } from "@tanstack/react-query";

export interface RIAFetchFilters {
    search?: string;
    date?: string;
    process?: string;
    subprocess?: string;
    stackholder?: number;
    inherent_risk_level?: string;
}

export const useFilteredRIA = (filters: RIAFetchFilters) => {
    return useQuery({
        queryKey: ["ria", filters],
        queryFn: () => fetchFilteredRIA(filters),
    });
};
