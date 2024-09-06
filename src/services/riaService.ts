import { apiClient } from "@/api/apiClient";
import { RIAFetchFilters } from "@/hooks/RIA/useFetchRIA";

export const fetchFilteredRIA = async (filters: RIAFetchFilters) => {
    const {
        search = "",
        date = "",
        process = "",
        subprocess = "",
        stackholder = null,
        inherent_risk_level = "",
    } = filters;
    const response = await apiClient.get(`/api/v1/risk_ia/`, {
        params: {
            search,
            date,
            process,
            subprocess,
            stackholder,
            inherent_risk_level,
        },
    });

    return response.data;
};
