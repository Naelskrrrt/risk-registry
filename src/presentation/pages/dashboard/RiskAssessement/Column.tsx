/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";

import { ColumnDef } from "@tanstack/react-table";

import {
    Risk,
    Stackholder,
    RiskTypes,
    AffectedArea,
} from "../Admin/constant/constant";

export const columns: ColumnDef<Risk>[] = [
    {
        accessorKey: "reference",
        id: "reference",
        header: "Référence",
    },
    {
        accessorKey: "process",
        id: "process",
        header: "Processus",
    },

    {
        accessorFn: (row) => row.stackholder, // récupère les données du stackholder
        accessorKey: "stackholder",
        id: "stackholder",
        header: "Stakeholder",
        cell: (info) => {
            const stacks = info?.getValue() as Stackholder[]; // Type assertion pour clarifier que stacks est un tableau de Stackholder
            return (
                <ul className="w-64">
                    {stacks?.map((stack) => (
                        <li key={stack.id} className="text-small">
                            • {stack.title}: {stack.name}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorFn: (row) => row.subprocess?.name,
        id: "subprocess",
        header: "Sous-processus",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "process_objectives",
        id: "process_objectives",
        header: "Objectifs du Processus",
    },
    {
        accessorKey: "inherent_risk_description",
        id: "inherent_risk_description",
        header: "Description du Risque Inhérent",
    },
    {
        accessorFn: (row) => row.risk_type,
        id: "risk_type",
        header: "Type de Risque",
        cell: (info) => {
            const types = info?.getValue() as RiskTypes[];
            return (
                <ul className="">
                    {types?.map((type) => (
                        <li key={type.id} className="text-small">
                            • {type.name}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "probability",
        id: "probability",
        header: "Probabilité",
    },
    {
        accessorKey: "impact",
        id: "impact",
        header: "Impact",
    },
    {
        accessorKey: "inherent_risk_level",
        id: "inherent_risk_level",
        header: "Niveau de Risque Inhérent",
        cell: (info) => {
            const riskLevel = info.getValue() as string;
            switch (riskLevel.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                default:
                    return <p>{riskLevel}</p>;
            }
        },
    },
    {
        accessorFn: (row) => row.affected_area,
        id: "affected_area",
        header: "Zone Affectée",
        cell: (info) => {
            const affecteds = info?.getValue() as AffectedArea[];
            return (
                <ul className="">
                    {affecteds?.map((affected) => (
                        <li key={affected.id} className="text-small">
                            • {affected.name}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "controls_in_place",
        id: "controls_in_place",
        header: "Contrôles en Place",
    },
    {
        accessorFn: (row) => row.category,
        id: "category",
        header: "Catégorie",
        cell: (info) => {
            const categories = info?.getValue() as AffectedArea[];
            return (
                <ul className="w-52">
                    {categories?.map((category) => (
                        <li key={category.id} className="text-small">
                            • {category.name}
                        </li>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "nature_of_control",
        id: "nature_of_control",
        header: "Nature du Contrôle",
    },
    {
        accessorKey: "automatic_or_manual_control",
        id: "automatic_or_manual_control",
        header: "Type de Contrôle (Automatique/Manuel)",
    },
    {
        accessorKey: "quality_of_the_control",
        id: "quality_of_the_control",
        header: "Qualité du Contrôle",
        cell: (info) => {
            const qualityControl = info.getValue() as string;
            switch (qualityControl.toLowerCase()) {
                case "acceptable":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-nextblue-300/30 font-semibold text-nextblue-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-nextblue-500" />
                            <p className="">{qualityControl}</p>
                        </div>
                    );
                case "strong":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{qualityControl}</p>
                        </div>
                    );
                case "weak":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-slate-300/30 font-semibold text-slate-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            <p className="">{qualityControl}</p>
                        </div>
                    );
                default:
                    return <p>{qualityControl}</p>;
            }
        },
    },
    {
        accessorKey: "residual_risk_level",
        id: "residual_risk_level",
        header: "Niveau de Risque Résiduel",
        cell: (info) => {
            const riskLevel = info.getValue() as string;
            switch (riskLevel.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{riskLevel}</p>
                        </div>
                    );
                default:
                    return <p>{riskLevel}</p>;
            }
        },
    },
    {
        accessorKey: "risk_strategy",
        id: "risk_strategy",
        header: "Stratégie de Risque",
    },
    {
        accessorKey: "detail_of_strategy",
        id: "detail_of_strategy",
        header: "Détails de la Stratégie",
    },
    {
        accessorKey: "date_of_assessment",
        id: "date_of_assessment",
        header: "Date d'Évaluation",
    },
    {
        accessorKey: "initiator",
        id: "initiator",
        header: "Initiateur",
    },
    {
        accessorKey: "action",
        id: "action",
        header: "Actions",
        cell: (row) => {
            return (
                <>
                    <Button
                        // onClick={() => setDialogOpen(true)}
                        variant="light"
                        color="primary"
                        isIconOnly
                        startContent={<Icon icon="solar:pen-outline" />}
                    />
                </>
            );
        },
    },
];
