import { apiClient } from "@/api/apiClient";
import {
    RiskITForm,
    RitFetchFilters,
} from "@/presentation/pages/dashboard/RiskIt/types";

export const fetchFilteredRit = async (filters: RitFetchFilters) => {
    const {
        search = "",
        date = "",
        stackholder = null,
        risk_strategy = "",
        category = null,
        level = "",
    } = filters;

    const response = await apiClient.get(`/api/v1/risk_it/`, {
        params: {
            search,
            date,
            stackholder,
            risk_strategy,
            category,
            level,
        },
    });

    return response.data;
};

export const fetchCategory = async () => {
    const response = await apiClient.get(`/api/v1/category/`);
    return response.data;
};

export const fetchExportToExcelRIT = async (filters: RitFetchFilters) => {
    const {
        search = "",
        date = "",
        stackholder = null,
        risk_strategy = "",
        category = null,
        level = "",
    } = filters;
    const response = await apiClient.get(`/api/v1/risk_it/export_to_excel/`, {
        responseType: "blob",
        params: {
            search,
            date,
            stackholder,
            risk_strategy,
            category,
            level,
        },
    });
    return response.data;
};

export const updateRit = async (ritID: number, ritData: RiskITForm) => {
    if (ritID === undefined) {
        throw new Error("RIT ID is required to update user");
    }

    console.log(ritData);

    try {
        const response = await apiClient.put(
            `/api/v1/risk_it/${ritID}/`,
            ritData
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

export const fetchHistoryRit = async (id?: number) => {
    const response = await apiClient.get(
        `/api/v1/history/retrieve_by_risk_it/${id}`
    );

    return response.data;
};
