import { apiClient } from "@/api/apiClient";
import { RIAFetchFilters } from "@/hooks/RIA/useFetchRIA";

export const fetchFilteredRIA = async (filters: RIAFetchFilters) => {
    const {
        search = "",
        date = "",
        process = null,
        subprocess = null,
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

export const fetchProcess = async () => {
    const response = await apiClient.get(`/api/v1/process/`);
    return response.data;
};

export const fetchSubprocess = async (process_id?: number) => {
    const response = await apiClient.get(
        `/api/v1/subprocess/filter_process/${process_id}`
    );
    return response.data;
};
