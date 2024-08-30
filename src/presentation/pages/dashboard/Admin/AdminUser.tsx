import {
    useFetchRoles,
    useFetchStackholder,
    useFilteredUsers,
} from "@/hooks/useFilteredUsers";
import { DataTable } from "@/presentation/components/globalTable";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Role, Stackholder, User } from "./constant/constant";

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
        accessorFn: (row) => row.role?.name,
        id: "role",
        header: "Role",
        cell: (info) => info.getValue(),
    },
    {
        accessorFn: (row) => row.stackholder?.name,
        id: "stackholder",
        header: "Stackholder",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "is_active",
        header: "Statut",
    },

    {
        accessorKey: "action",
        header: "",
        cell: () => {
            return (
                <Button
                    variant="light"
                    color="primary"
                    isIconOnly
                    startContent={<Icon icon="solar:pen-outline" />}
                />
            );
        },
    },
];

const AdminUser = () => {
    const [search, setSearch] = useState<string>("");
    const [role, setRole] = useState<number>();
    const [stackholder, setStackholder] = useState<number>();

    const { data: users, isLoading } = useFilteredUsers({
        search,
        role,
        stackholder,
    });
    const { data: roles } = useFetchRoles();
    const { data: stackholders } = useFetchStackholder();

    // const uniqueRoles = Array.from(
    //     new Set(roles?.map((role: Role) => role.name))
    // ).map((name) => {
    //     return roles?.find((role: Role) => role.name === name);
    // });

    // const uniqueStack = Array.from(
    //     new Set(stackholders?.map((item: Stackholder) => item.name))
    // ).map((name) => {
    //     return stackholders?.find((item: Stackholder) => item.name === name);
    // });
    // console.log("stack :", uniqueStack);

    // if (isLoading) return <p>Loading...</p>;

    return (
        <div className="w-full flex h-full overflow-hidden relative py-1 flex-col gap-3">
            <div className="w-full flex justify-between h-fit ">
                <div className="flex gap-2">
                    <Input
                        startContent={<Icon icon="solar:magnifer-outline" />}
                        placeholder="Search ..."
                        color="primary"
                        size="md"
                        classNames={{ input: "rounded-lg w-[250px]" }}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Dropdown placement="right-start">
                        <DropdownTrigger>
                            <Button
                                color="primary"
                                isIconOnly
                                className="rounded-md">
                                <Icon
                                    icon={"solar:filter-bold-duotone"}
                                    fontSize={22}
                                />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Main menu"
                            closeOnSelect={false}>
                            <DropdownItem key="nested">
                                <Dropdown placement="right-start">
                                    <DropdownTrigger className="p-0 ">
                                        <Button
                                            variant="flat"
                                            className=" text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                            startContent={
                                                <Icon
                                                    icon={
                                                        "solar:user-bold-duotone"
                                                    }
                                                />
                                            }>
                                            Role
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Nested menu">
                                        {roles?.map((role: Role) => (
                                            <DropdownItem
                                                key={role?.id}
                                                onClick={() =>
                                                    setRole(role?.id)
                                                }>
                                                {role?.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                            <DropdownItem key="nested item">
                                <Dropdown placement="right-start">
                                    <DropdownTrigger className="p-0 ">
                                        <Button
                                            variant="flat"
                                            className=" text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                            startContent={
                                                <Icon
                                                    icon={
                                                        "solar:user-bold-duotone"
                                                    }
                                                />
                                            }>
                                            Stakeholders
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Nested menu">
                                        {stackholders?.map(
                                            (stack: Stackholder) => (
                                                <DropdownItem
                                                    className={
                                                        stack?.id ===
                                                        stackholder
                                                            ? "bg-primary text-white"
                                                            : ""
                                                    }
                                                    key={stack?.id}
                                                    onClick={() => {
                                                        return stack?.id ===
                                                            stackholder
                                                            ? setStackholder(
                                                                  undefined
                                                              )
                                                            : setStackholder(
                                                                  stack?.id
                                                              );
                                                    }}>
                                                    {stack?.name}
                                                </DropdownItem>
                                            )
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
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
            <div className="w-full h-full relative bg-transparent rounded-md overflow-hidden">
                {isLoading ? (
                    "loading..."
                ) : (
                    <DataTable
                        isLoading={isLoading}
                        data={users ? users : []}
                        columns={columns}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminUser;
