import { z } from "zod";
import { Risk as RiskIA } from "../../Admin/constant/constant";

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
    defaultValues?: RiskIA;
};

export interface RiskAssessment {
    affected_area: number[]; // Tableau d'identifiants pour les zones affectées
    automatic_or_manual_control: "Manual" | "Automatic" | "Semi automatic"; // Contrôle automatique ou manuel
    category?: number[]; // Tableau d'identifiants pour les catégories
    controls_in_place: string; // Description des contrôles en place
    detail_of_strategy: string; // Détails de la stratégie
    impact: number; // Impact (valeur numérique)
    inherent_risk_description: string; // Description du risque inhérent

    nature_of_control:
        | "Preventive"
        | "Detective"
        | "Directive"
        | "Compensating"
        | undefined; // Nature du contrôle
    probability: number; // Probabilité (valeur numérique)
    process: number; // Identifiant du processus
    process_objectives: string; // Objectifs du processus
    quality_of_the_control: "Strong" | "Acceptable" | "Weak"; // Qualité du contrôle
    reference: string; // Référence (chaîne de caractères)

    risk_strategy: "Tolerate" | "Treat" | "Transfert" | "Terminate"; // Stratégie de risque
    risk_type?: number[]; // Tableau d'identifiants pour les types de risque
    stackholder?: number[]; // Tableau d'identifiants pour les parties prenantes
    subprocess?: number; // Identifiant du sous-processus
}
