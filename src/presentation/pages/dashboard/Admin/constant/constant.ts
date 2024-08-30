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

export type Role = {
    id: number;
    title: string;
    name: string;
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
