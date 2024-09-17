import { apiClient } from "@/api/apiClient";
import { RIAFetchFilters } from "@/hooks/RIA/useFetchRIA";
import { Risk } from "@/presentation/pages/dashboard/Admin/constant/constant";

export const fetchFilteredRIA = async (filters: RIAFetchFilters) => {
    const {
        search = "",
        date = "",
        process = null,
        subprocess = null,
        stackholder = null,
        inherent_risk_level = null,
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

export const fetchExportToExcelRIA = async (filters: RIAFetchFilters) => {
    const {
        search = "",
        date = "",
        process = null,
        subprocess = null,
        stackholder = null,
        inherent_risk_level = "",
    } = filters;
    const response = await apiClient.get(`/api/v1/risk_ia/export_to_excel/`, {
        responseType: "blob",
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

export const fetchRiskType = async () => {
    const response = await apiClient.get("/api/v1/risk_type/");

    return response.data;
};

export const fetchAffectedArea = async () => {
    const response = await apiClient.get("/api/v1/affected_area/");

    return response.data;
};

export const fetchCategory = async () => {
    const response = await apiClient.get("/api/v1/category/");

    return response.data;
};

export const updateRia = async (riaID: number | undefined, riaData: Risk) => {
    if (riaID === undefined) {
        throw new Error("User ID is required to update user");
    }

    console.log(riaData);

    try {
        const response = await apiClient.put(
            `/api/v1/risk_ia/${riaID}/`,
            riaData
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
