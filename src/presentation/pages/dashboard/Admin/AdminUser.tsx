import { DataTable } from "@/presentation/components/globalTable";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "./constant/constant";
import { useFilteredUsers } from "@/hooks/useFilteredUsers";
import { useForm } from "react-hook-form";

const columns: ColumnDef<User>[] = [
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

const AdminUser = () => {
    const { control, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            search: "",
            role: "",
            stackholder: "",
        },
    });

    const search = watch("search");
    const role = watch("role");
    const stackholder = watch("stackholder");

    const { data, isLoading } = useFilteredUsers({
        search,
        role,
        stackholder,
    });

    const users = data?.results;

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="w-full flex justify-between h-fit py-1 flex-col gap-3">
            <div className="w-full flex justify-between h-fit  ">
                <div className="flex gap-2">
                    <Input
                        startContent={<Icon icon="solar:magnifer-outline" />}
                        placeholder="Search ..."
                        color="primary"
                        size="md"
                        classNames={{ input: "rounded-lg w-[250px]" }}
                    />
                    <Tooltip
                        content="Filtrer"
                        placement="right"
                        color="primary">
                        <Button
                            isIconOnly={true}
                            children={<Icon icon="solar:filter-bold" />}
                            className="bg-nextblue-500 text-white text-lg font-bold rounded-lg hover:bg-nextblue-600"
                        />
                    </Tooltip>
                </div>
                <div className="flex gap-2">
                    <Tooltip
                        content="Exporter"
                        placement="left"
                        color="primary">
                        <Button
                            isIconOnly={true}
                            children={<Icon icon="solar:download-linear" />}
                            className="bg-white text-slate-950 text-lg font-bold rounded-lg hover:bg-slate-50"
                        />
                    </Tooltip>
                    <Button
                        size="md"
                        className="bg-nextblue-500 text-white   rounded-lg hover:bg-nextblue-600">
                        Ajouter
                    </Button>
                    <Button
                        size="md"
                        className="bg-slate-800 text-white   rounded-lg hover:bg-nextblue-900">
                        Importer
                    </Button>
                </div>
            </div>

            {/* <UserList /> */}
            <div className="w-full h-96 bg-white rounded-md">
                <DataTable data={users} columns={columns} />
            </div>
        </div>
    );
};

export default AdminUser;
