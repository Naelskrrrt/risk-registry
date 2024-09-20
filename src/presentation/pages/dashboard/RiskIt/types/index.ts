import { Stackholder } from "../../Admin/constant/constant";

export type RitFetchFilters = {
    search?: string;
    date?: string;
    stackholder?: number;
    risk_strategy?: string;
    category?: number[] | number;
    level?: string;
};

export type Category = {
    id: number;
    name: string;
};

export type RiskIT = {
    id?: number;
    category: Category[];
    threat: string;
    level: string;
    vulnerability: string;
    asset: string;
    inherent_risk_level: string | number;
    previous_level_of_inherent_risk: string | number;
    previous_level_of_residual_risk: string | number;
    existing_controls_mitigation: string;
    probability: number;
    impact: number;
    current_level: number;
    priority: string;
    controls_in_place: string;
    residual_risk_score: number;
    risk_strategy: string;
    treatment_strategy: string;
    stackholder: Stackholder[];
    date_of_assessment: string;
    initiator: string;
    created_at: string;
};

export type RiskITForm = {
    category?: number[]; //
    threat: string; //
    level: string; //
    vulnerability: string; //
    asset: string; //
    inherent_risk_level: string | number; //
    previous_level_of_inherent_risk: string | number; //
    previous_level_of_residual_risk: string | number; //
    existing_controls_mitigation: string; //
    probability: number; //
    impact: number; //
    priority: string; //
    controls_in_place: string; //
    risk_strategy: string; //
    treatment_strategy: string; //
    stackholder?: number[];
};
export type RitDialogProps = {
    refetch?: () => void;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (value: boolean) => void;
    defaultValues?: RiskIT;
};
