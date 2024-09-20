/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from "@tanstack/react-table";

import { Stackholder } from "../Admin/constant/constant";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { RitDialog } from "./components/ritDialog";
import RitHistory from "./components/ritHistory";
import { Category, RiskIT } from "./types";

export const columns: ColumnDef<RiskIT>[] = [
    {
        accessorKey: "action",
        id: "action",
        header: "Actions",
        cell: (row) => {
            const [dialogOpen, setDialogOpen] = useState<boolean>(false);
            const [historyOpen, setHistoryOpen] = useState<boolean>(false);
            return (
                <div className="flex pr-2 py-1 gap-1 ">
                    <Button
                        onClick={() => setDialogOpen(true)}
                        variant="light"
                        color="primary"
                        isIconOnly
                        startContent={<Icon icon="solar:pen-outline" />}
                    />
                    <Button
                        onClick={() => setHistoryOpen(true)}
                        variant="light"
                        color="warning"
                        isIconOnly
                        startContent={<Icon icon="solar:calendar-outline" />}
                    />
                    <RitDialog
                        defaultValues={row.row.original}
                        isDialogOpen={dialogOpen}
                        setIsDialogOpen={setDialogOpen}
                    />{" "}
                    <RitHistory
                        // refetch={refetch}
                        defaultValues={row.row.original}
                        isDialogOpen={historyOpen}
                        setIsDialogOpen={setHistoryOpen}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "id-date",
        id: "id-date",
        header: "ID",
        cell: (info) => {
            const row = info.row.original;
            const created_at = formatDate(row.created_at);
            const id = row.id;
            console.log(created_at);
            console.log(row);
            return `${created_at}-${id}`;
        },
    },
    {
        accessorKey: "category",
        id: "category",
        header: "Category",
        cell: (info) => {
            const categories = info.getValue() as Category[];
            return (
                <ul className="w-24">
                    {categories.map((cat) => (
                        <li key={cat.id} className="text-small">
                            • {cat.name}
                        </li>
                    ))}
                </ul>
            );
        },
    },

    {
        accessorKey: "threat",
        id: "threat",
        header: "Threat",
    },
    {
        accessorKey: "stackholder",
        id: "stackholder",
        header: "Stakeholder",
        cell: (info) => {
            const stacks = info?.getValue() as Stackholder[];
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
        accessorKey: "level",
        id: "level",
        header: "Level",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "vulnerability",
        id: "vulnerability",
        header: "Vulnerability",
    },
    {
        accessorKey: "asset",
        id: "asset",
        header: "Asset",
    },
    {
        accessorKey: "inherent_risk_level",
        id: "inherent_risk_level",
        header: "Inherent Risk Level",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "previous_level_of_inherent_risk",
        id: "previous_level_of_inherent_risk",
        header: "Previous Level of inherent Risk",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "previous_level_of_residual_risk",
        id: "previous_level_of_residual_risk",
        header: "Previous Level of Residual Risk",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "existing_controls_mitigation",
        id: "existing_controls_mitigation",
        header: "Existing controls mitigation",
    },
    {
        accessorKey: "probability",
        id: "probability",
        header: "Probability",
    },
    {
        accessorKey: "impact",
        id: "impact",
        header: "Impact",
    },
    {
        accessorKey: "current_level",
        id: "current_level",
        header: "Current Level",
        cell: (info) => {
            const riskLevel = info.getValue() as number;
            switch (true) {
                case riskLevel <= 2:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">Low</p>
                        </div>
                    );
                case riskLevel > 2 && riskLevel <= 5:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">Medium</p>
                        </div>
                    );
                case riskLevel > 5:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">High</p>
                        </div>
                    );
                default:
                    return <p>{riskLevel}</p>;
            }
        },
    },
    {
        accessorKey: "priority",
        id: "priority",
        header: "Priority",
    },
    {
        accessorKey: "controls_in_place",
        id: "controls_in_place",
        header: "Controls in Place",
    },
    {
        accessorKey: "residual_risk_score",
        id: "residual_risk_score",
        header: "Residual Risk Score",
    },
    {
        accessorKey: "risk_strategy",
        id: "risk_strategy",
        header: "Risk Strategy",
    },
    {
        accessorKey: "treatment_strategy",
        id: "treatment_strategy",
        header: "Treatment Strategy",
    },

    {
        accessorKey: "date_of_assessment",
        id: "date_of_assessment",
        header: "Date of Assessement",
    },
    {
        accessorKey: "initiator",
        id: "initiator",
        header: "Initiator",
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Ajouter un zéro devant si nécessaire
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format de date souhaité
};

export const historyColumns: ColumnDef<RiskIT>[] = [
    {
        accessorKey: "id-date",
        id: "id-date",
        header: "ID",
        cell: (info) => {
            const row = info.row.original;
            const created_at = formatDate(row.created_at);
            const id = row.id;
            console.log(created_at);
            console.log(row);
            return `${created_at}-${id}`;
        },
    },
    {
        accessorKey: "created_at",
        id: "created_at",
        header: "Date de modification",
        cell: (info) => {
            const date = info?.getValue() as string; // Assurez-vous que c'est une chaîne de caractères
            return <div className="w-fit">{formatDate(date)}</div>; // Utiliser la fonction de formatage ici
        },
    },

    {
        accessorKey: "threat",
        id: "threat",
        header: "Threat",
    },
    {
        accessorKey: "level",
        id: "level",
        header: "Level",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "vulnerability",
        id: "vulnerability",
        header: "Vulnerability",
    },
    {
        accessorKey: "asset",
        id: "asset",
        header: "Asset",
    },
    {
        accessorKey: "inherent_risk_level",
        id: "inherent_risk_level",
        header: "Inherent Risk Level",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },

    {
        accessorKey: "previous_level_of_inherent_risk",
        id: "previous_level_of_inherent_risk",
        header: "Previous Level of inherent Risk",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "previous_level_of_residual_risk",
        id: "previous_level_of_residual_risk",
        header: "Previous Level of Residual Risk",
        cell: (info) => {
            const level = info.getValue() as string;
            switch (level.toLowerCase()) {
                case "low":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "medium":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                case "high":
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">{level}</p>
                        </div>
                    );
                default:
                    return <p>{level}</p>;
            }
        },
    },
    {
        accessorKey: "existing_controls_mitigation",
        id: "existing_controls_mitigation",
        header: "Existing controlos mitigation",
    },
    {
        accessorKey: "probability",
        id: "probability",
        header: "Probability",
    },
    {
        accessorKey: "impact",
        id: "impact",
        header: "Impact",
    },
    {
        accessorKey: "current_level",
        id: "current_level",
        header: "Current Level",
        cell: (info) => {
            const riskLevel = info.getValue() as number;
            switch (true) {
                case riskLevel <= 2:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-green-300/30 font-semibold text-green-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="">Low</p>
                        </div>
                    );
                case riskLevel > 2 && riskLevel <= 5:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-yellow-300/30 font-semibold text-yellow-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="">Medium</p>
                        </div>
                    );
                case riskLevel > 5:
                    return (
                        <div className="flex w-fit px-3 py-1 pr-4 gap-2 items-center justify-center bg-red-300/30 font-semibold text-red-500 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="">High</p>
                        </div>
                    );
                default:
                    return <p>{riskLevel}</p>;
            }
        },
    },
    {
        accessorKey: "priority",
        id: "priority",
        header: "Priority",
    },
    {
        accessorKey: "controls_in_place",
        id: "controls_in_place",
        header: "Controls in Place",
    },
    {
        accessorKey: "residual_risk_score",
        id: "residual_risk_score",
        header: "Residual Risk Score",
    },
    {
        accessorKey: "risk_strategy",
        id: "risk_strategy",
        header: "Risk Strategy",
    },
    {
        accessorKey: "treatment_strategy",
        id: "treatment_strategy",
        header: "Treatment Strategy",
    },

    {
        accessorKey: "date_of_assessment",
        id: "date_of_assessment",
        header: "Date d'évaluation",
    },
];
