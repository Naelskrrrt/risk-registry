import { z } from "zod";
import { Risk } from "../../Admin/constant/constant";

/* eslint-disable @typescript-eslint/no-unused-vars */
export type Subprocess = {
    id: number;
    process: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

type Stackholder = {
    id: number;
    title: string;
    name: string;
    description: string;
};

export type Process = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

type RiskType = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

type AffectedArea = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

type Category = {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    of_control: boolean;
};

export const RIAschema = z.object({
    reference: z
        .string()
        .min(1, { message: "Le champ 'reference' est obligatoire" }),
    process_objectives: z
        .string()
        .min(1, { message: "Le champ 'process_objectives' est obligatoire" }),
    inherent_risk_description: z.string().min(1, {
        message: "Le champ 'inherent_risk_description' est obligatoire",
    }),
    probability: z
        .number()
        .min(1, { message: "Le champ 'probability' est obligatoire" }),
    impact: z.number().min(1, { message: "Le champ 'impact' est obligatoire" }),
    quality_of_the_control: z
        .string()
        .min(1, { message: "Le champ 'nature_of_control' est obligatoire" }),
    automatic_or_manual_control: z.string().min(1, {
        message: "Le champ 'automatic_or_manual_control' est obligatoire",
    }),
    detail_of_strategy: z
        .string()
        .min(1, { message: "Le champ 'detail_of_strategy' est obligatoire" }),

    controls_in_place: z
        .string()
        .min(1, { message: "Le champ 'controls_in_place' est obligatoire" }),
});

export type RIADialogProps = {
    refetch?: () => void;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (value: boolean) => void;
    defaultValues?: Risk;
};

export type RiskAssessment = {
    reference: string;
    process: number | undefined;
    subprocess: number | undefined;
    stackholder?: number[];
    process_objectives: string;
    inherent_risk_description: string;
    risk_type: number[] | string;
    probability: number | string;
    impact: number | string;
    inherent_risk_level: string;
    affected_area: number[] | string;
    controls_in_place: string;
    category: number[] | string;
    nature_of_control: string;
    automatic_or_manual_control: string;
    quality_of_the_control: string;
    residual_risk_level: string;
    risk_strategy: string;
    detail_of_strategy: string;
    date_of_assessment: string;
    initiator: string;
};
