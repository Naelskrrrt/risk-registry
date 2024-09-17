/* eslint-disable react-hooks/rules-of-hooks */
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
import { RiaDialog } from "./components/riaDialog";
import { useState } from "react";
import { Process, RiskAssessment } from "./types/Columns";

export const columns: ColumnDef<Risk>[] = [
    {
        accessorKey: "reference",
        id: "reference",
        header: "Reference",
        cell: (info) => {
            return <div className="w-fit">{info?.getValue() as string}</div>;
        },
    },
    {
        accessorFn: (row) => row.process,
        accessorKey: "process",
        id: "process",
        header: "Process",
        cell: (info) => {
            const process = info?.getValue() as Process;
            console.log(process);
            return <div className="w-fit">{process.name}</div>;
        },
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
        header: "Subprocess",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "inherent_risk_level",
        id: "inherent_risk_level",
        header: "Inherent Risk Level",
        cell: (info) => {
            const riskLevel = info.getValue() as number;
            switch (riskLevel) {
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
        accessorKey: "inherent_risk_description",
        id: "inherent_risk_description",
        header: "Inherent Risk Description",
    },
    {
        accessorFn: (row) => row.risk_type,
        id: "risk_type",
        header: "Type of Risk",
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
        header: "Probability",
    },
    {
        accessorKey: "impact",
        id: "impact",
        header: "Impact",
    },

    {
        accessorFn: (row) => row.affected_area,
        id: "affected_area",
        header: "Affected Area",
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
        header: "Controls in Place",
    },
    {
        accessorFn: (row) => row.category,
        id: "category",
        header: "Category",
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
        header: "Nature of Control",
    },
    {
        accessorKey: "process_objectives",
        id: "process_objectives",
        header: "Process Objectives",
    },
    {
        accessorKey: "automatic_or_manual_control",
        id: "automatic_or_manual_control",
        header: "Type Of Control (Automatique/Manuel)",
    },
    {
        accessorKey: "quality_of_the_control",
        id: "quality_of_the_control",
        header: "Quality of the Control",
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
        header: "Residual Risk Level",
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
        header: "Risk Strategy",
    },
    {
        accessorKey: "detail_of_strategy",
        id: "detail_of_strategy",
        header: "Detail of Strategy",
    },
    {
        accessorKey: "date_of_assessment",
        id: "date_of_assessment",
        header: "Date of Assessment",
    },
    {
        accessorKey: "initiator",
        id: "initiator",
        header: "Initiator",
    },
    {
        accessorKey: "action",
        id: "action",
        header: "Actions",
        cell: (row) => {
            const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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
                        // onClick={() => setDialogOpen(true)}
                        variant="light"
                        color="warning"
                        isIconOnly
                        startContent={<Icon icon="solar:calendar-outline" />}
                    />
                    <RiaDialog
                        // refetch={refetch}
                        defaultValues={row.row.original}
                        isDialogOpen={dialogOpen}
                        setIsDialogOpen={setDialogOpen}
                    />
                </div>
            );
        },
    },
];
