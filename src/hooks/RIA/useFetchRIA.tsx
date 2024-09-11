import {
    fetchFilteredRIA,
    fetchProcess,
    fetchSubprocess,
} from "@/services/riaService";
import { useQuery } from "@tanstack/react-query";

export interface RIAFetchFilters {
    search?: string;
    date?: string;
    process?: number;
    subprocess?: number;
    stackholder?: number;
    inherent_risk_level?: string;
}

export const useFilteredRIA = (filters: RIAFetchFilters) => {
    console.log("Filters", filters);
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
