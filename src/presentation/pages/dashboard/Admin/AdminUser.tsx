/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "@/context/AuthProvider";
import {
    useExportToExcel,
    useFetchRoles,
    useFetchStackholder,
    useFilteredUsers,
} from "@/hooks/Users/useFetchUsers";
import { usePatchUserState } from "@/hooks/Users/useHandleUsers";
import { formatDate } from "@/lib/formatDate";
import { DataTable } from "@/presentation/components/globalTable";
import Loader from "@/presentation/components/loader/loader";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@nextui-org/button";
import { DateRangePicker } from "@nextui-org/date-picker";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Role, Stackholder, User } from "./constant/constant";
import { UserDialog } from "./components/userDialog";
import FileImportDialog from "./components/fileDialog";

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        id: "id",
        header: "ID",
    },
    {
        accessorKey: "session",
        id: "session",
        header: "Session",
    },
    {
        accessorKey: "name",
        id: "name",
        header: "Nom",
    },
    {
        accessorKey: "email",
        id: "email",
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
        id: "is_active",
        header: "Statut",
        cell: (row) => {
            const {
                mutate: patchUserState,
                isPending,
                data: response,
                isSuccess,
            } = usePatchUserState();
            const selected: boolean = row.getValue() as boolean;
            const [isSelected, setIsSelected] = useState<boolean>(selected);
            const { user } = useAuth();
            useEffect(() => {
                if (isSuccess) {
                    toast.success("Statut Modifié", {
                        description: `${response.message}`,
                    });
                }
            }, [response, isSuccess]);
            const userId = row.row.original.id;
            const currentUserId = user?.user_id;
            if (userId === currentUserId) return null;
            return (
                <div className="flex flex-col gap-2">
                    <Switch
                        color="success"
                        isSelected={isSelected}
                        onValueChange={() => {
                            patchUserState({
                                userId: row.row.original.id as number,
                                isActive: !isSelected,
                            });
                            setIsSelected(!isSelected);
                        }}
                        isDisabled={isPending}
                    />
                </div>
            );
        },
    },

    {
        accessorKey: "action",
        id: "action",
        header: "",
        cell: (row) => {
            const [dialogOpen, setDialogOpen] = useState<boolean>(false);
            const { id, session, name, email, role, stackholder } =
                row.row.original;
            const defaultValue = {
                id,
                session,
                name,
                email,
                role,
                stackholder,
            };
            return (
                <>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        variant="light"
                        color="primary"
                        isIconOnly
                        startContent={<Icon icon="solar:pen-outline" />}
                    />
                    <UserDialog
                        // refetch={refetch}
                        defaultValues={defaultValue}
                        isDialogOpen={dialogOpen}
                        setIsDialogOpen={setDialogOpen}
                    />
                </>
            );
        },
    },
];

const AdminUser = () => {
    const [search, setSearch] = useState<string>("");
    const [role, setRole] = useState<number>();
    const [stackholder, setStackholder] = useState<number>();
    const [dateRange, dateRangeSet] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const {
        data: users,
        isLoading,
        refetch,
    } = useFilteredUsers({
        search,
        role,
        stackholder,
        date: dateRange,
    });

    const { mutate: exportToExcel, isPending: waitExport } = useExportToExcel({
        search,
        role,
        stackholder,
        date: dateRange,
    });

    const { data: roles } = useFetchRoles();
    const { data: stackholders } = useFetchStackholder();

    const resetFilters = () => {
        setSearch("");
        setRole(undefined);
        setStackholder(undefined);
        dateRangeSet("");
    };

    const refreshData = async () => {
        try {
            // Réinitialiser les filtres
            resetFilters();

            // Appel à refetch pour obtenir les données les plus récentes
            await refetch();

            // Optionnel : Afficher une notification de succès

            toast.success("Données rafraîchies", {
                description: "Les données ont été mises à jour avec succès.",
            });
        } catch (error) {
            // Afficher une notification d'erreur
            toast.error("Erreur de rafraîchissement", {
                description:
                    "Impossible de rafraîchir les données. Veuillez réessayer.",
            });
            return error;
        }
    };
    return (
        <div className="w-full flex h-full overflow-hidden relative py-1 flex-col gap-3">
            <div className="w-full flex justify-between h-fit ">
                <div className="flex gap-2 h-full relative">
                    <Input
                        startContent={<Icon icon="solar:magnifer-outline" />}
                        placeholder="Search ..."
                        color="primary"
                        size="lg"
                        classNames={{ input: "rounded-lg w-[250px]" }}
                        value={search} // Ajout de la valeur de l'input
                        onChange={(e) => setSearch(e.target.value)}
                        endContent={
                            search && (
                                <Icon
                                    icon="solar:close-circle-line-duotone"
                                    fontSize={22}
                                    onClick={() => setSearch("")}
                                    className="cursor-pointer"
                                />
                            )
                        }
                    />
                    <DateRangePicker
                        label="Filtrer le Date d'ajout"
                        color="primary"
                        onChange={(date) => {
                            const start = formatDate(date.start);
                            const end = formatDate(date.end);
                            dateRangeSet(`${start},${end}`);
                        }}
                        className="h-full"
                        size="sm"
                    />
                    <Dropdown placement="right-start">
                        <DropdownTrigger>
                            <Button
                                color="primary"
                                isIconOnly
                                className="rounded-md"
                                size="lg">
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
                                        {roles?.map((rol: Role) => (
                                            <DropdownItem
                                                className={
                                                    rol?.id === role
                                                        ? "bg-primary text-white"
                                                        : ""
                                                }
                                                key={rol?.id}
                                                onClick={() => {
                                                    return rol?.id === role
                                                        ? setRole(undefined)
                                                        : setRole(rol?.id);
                                                }}>
                                                {rol?.name}
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
                    <Button
                        isIconOnly
                        onClick={refreshData}
                        variant="shadow"
                        color="danger"
                        title="Revalider les données"
                        className="relative">
                        <Icon icon={"solar:refresh-outline"} fontSize={22} />
                    </Button>

                    <Button
                        isIconOnly={true}
                        children={<Icon icon="solar:download-linear" />}
                        className="bg-white text-slate-950 text-lg font-bold rounded-lg hover:bg-slate-50"
                        onClick={() => exportToExcel()}
                        disabled={waitExport}
                        title="Exporter les utilisateurs"
                    />
                    <Button
                        size="md"
                        className="bg-nextblue-500 text-white   rounded-lg hover:bg-nextblue-600"
                        onClick={() => {
                            setDialogOpen(true);
                        }}>
                        Ajouter
                    </Button>
                    <FileImportDialog />
                </div>
            </div>

            {/* <UserList /> */}
            <div className="w-full h-full relative bg-transparent rounded-md ">
                {isLoading ? (
                    <Loader />
                ) : (
                    <DataTable
                        ListPerPage={7}
                        isLoading={isLoading}
                        data={users ? users : []}
                        columns={columns}
                    />
                )}
            </div>
            <UserDialog
                refetch={refreshData}
                isDialogOpen={dialogOpen}
                setIsDialogOpen={setDialogOpen}
            />
        </div>
    );
};

export default AdminUser;
