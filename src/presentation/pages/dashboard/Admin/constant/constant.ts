import { ColumnDef } from "@tanstack/react-table";

export type User = {
    id?: number;
    session?: string;
    name?: string;
    email?: string;
    is_active?: boolean;
    date_joined?: string;
    role?: Role | undefined;
    stackholder?: Stackholder | undefined;
};

export type Stackholder = {
    id: number;
    title: string;
    name: string;
};

export type RiskTypes = {
    id: number;
    name: string;
    description: string;
};

export type AffectedArea = {
    id: number;
    name: string;
    description: string;
};

export type Role = {
    id: number;
    title: string;
    name: string;
};

export type Risk = {
    id: number;
    reference: string;
    process: {
        id: number;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
    };
    subprocess: {
        id: number;
        process: string;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
    } | null;
    stackholder: Stackholder[];
    process_objectives: string;
    inherent_risk_description: string;
    risk_type: {
        id: number;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
    }[];
    probability: number;
    impact: number;
    inherent_risk_level: string;
    affected_area: {
        id: number;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
    }[];
    controls_in_place: string;
    category: {
        id: number;
        name: string;
        description: string;
        created_at: string;
        updated_at: string;
        of_control: boolean;
    }[];
    nature_of_control: string;
    automatic_or_manual_control: string;
    quality_of_the_control: string;
    residual_risk_level: string;
    risk_strategy: string;
    detail_of_strategy: string;
    date_of_assessment: string;
    initiator: string;
    created_at: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "session",
        header: "Session",
    },
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "stackholder",
        header: "Stackholder",
    },
    {
        accessorKey: "is_active",
        header: "Statut",
    },
    {
        accessorKey: "date_joined",
        header: "Date de création",
    },
];
