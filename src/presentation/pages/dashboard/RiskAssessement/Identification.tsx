import { useAuth } from "@/context/AuthProvider";
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
import FileImportDialog from "../Admin/components/fileDialog";
import { DataTable } from "@/presentation/components/globalTable";
import { ColumnDef } from "@tanstack/react-table";
import { Risk } from "../Admin/constant/constant";
import { useFilteredRIA } from "@/hooks/RIA/useFetchRIA";

const columns: ColumnDef<Risk>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "date_of_assessment",
        header: "Date d'Évaluation",
    },
    {
        accessorKey: "initiator",
        header: "Initiateur",
    },
    {
        accessorKey: "reference",
        header: "Référence",
    },
    {
        accessorKey: "process",
        header: "Processus",
    },
    {
        accessorFn: (row) => row.subprocess?.name,
        id: "subprocess",
        header: "Sous-processus",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "process_objectives",
        header: "Objectifs du Processus",
    },
    {
        accessorKey: "inherent_risk_description",
        header: "Description du Risque Inhérent",
    },
    {
        accessorFn: (row) => row.risk_type?.map((r) => r.name).join(", "),
        id: "risk_type",
        header: "Type de Risque",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "probability",
        header: "Probabilité",
    },
    {
        accessorKey: "impact",
        header: "Impact",
    },
    {
        accessorKey: "inherent_risk_level",
        header: "Niveau de Risque Inhérent",
    },
    {
        accessorFn: (row) => row.affected_area?.map((a) => a.name).join(", "),
        id: "affected_area",
        header: "Zone Affectée",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "controls_in_place",
        header: "Contrôles en Place",
    },
    {
        accessorFn: (row) => row.category?.map((c) => c.name).join(", "),
        id: "category",
        header: "Catégorie",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "nature_of_control",
        header: "Nature du Contrôle",
    },
    {
        accessorKey: "automatic_or_manual_control",
        header: "Type de Contrôle (Automatique/Manuel)",
    },
    {
        accessorKey: "quality_of_the_control",
        header: "Qualité du Contrôle",
    },
    {
        accessorKey: "residual_risk_level",
        header: "Niveau de Risque Résiduel",
    },
    {
        accessorKey: "risk_strategy",
        header: "Stratégie de Risque",
    },
    {
        accessorKey: "detail_of_strategy",
        header: "Détails de la Stratégie",
    },
    {
        accessorKey: "date_of_assessment",
        header: "Date d'Évaluation",
    },
    {
        accessorKey: "initiator",
        header: "Initiateur",
    },
    {
        accessorKey: "action",
        header: "Actions",
        cell: (row) => {
            // const [dialogOpen, setDialogOpen] = useState<boolean>(false);
            // const { id, reference, process, subprocess, process_objectives } =
            //     row.row.original;
            // const defaultValue = {
            //     id,
            //     reference,
            //     process,
            //     subprocess,
            //     process_objectives,
            // };
            return (
                <>
                    <Button
                        // onClick={() => setDialogOpen(true)}
                        variant="light"
                        color="primary"
                        isIconOnly
                        startContent={<Icon icon="solar:pen-outline" />}
                    />
                    {/* <RiskDialog
                        defaultValues={defaultValue}
                        isDialogOpen={dialogOpen}
                        setIsDialogOpen={setDialogOpen}
                    /> */}
                </>
            );
        },
    },
];

const Identification = () => {
    const { user } = useAuth();
    console.log(user);
    const { data: ria, isLoading, refetch } = useFilteredRIA({});
    return (
        <div className="w-full flex h-full overflow-hidden py-1 flex-col gap-3">
            <div className="w-full relative flex justify-between h-fit overflow-x-auto">
                <div className="flex gap-2 h-full relative py-1">
                    <Input
                        startContent={<Icon icon="solar:magnifer-outline" />}
                        placeholder="Search ..."
                        color="primary"
                        size="md"
                        classNames={{
                            input: "rounded-lg w-[250px]",
                        }}
                        // value={search} // Ajout de la valeur de l'input
                        // onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateRangePicker
                        label="Filtrer le Date d'ajout"
                        // defaultValue={{
                        //     start: { date: defaultStartDate },
                        //     end: { date: defaultEndDate },
                        // }}
                        color="primary"
                        // onChange={(date) => {
                        //     const start = formatDate(date.start);
                        //     const end = formatDate(date.end);
                        //     dateRangeSet(`${start},${end}`);
                        // }}
                        className="h-full"
                        size="sm"
                    />
                    <Dropdown placement="right-start">
                        <DropdownTrigger>
                            <Button
                                color="primary"
                                isIconOnly
                                className="rounded-md"
                                size="md">
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
                                        <DropdownItem>Role</DropdownItem>
                                        {/* {roles?.map((rol: Role) => (
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
                                        ))} */}
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
                                        <DropdownItem>
                                            Stakeholders
                                        </DropdownItem>
                                        {/* {stackholders?.map(
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
                                        )} */}
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="flex gap-2">
                    <Button
                        isIconOnly
                        // onClick={refreshData}
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
                        // onClick={() => exportToExcel()}
                        // disabled={waitExport}
                        title="Exporter les utilisateurs"
                    />
                    <Button
                        size="md"
                        className="bg-nextblue-500 text-white   rounded-lg hover:bg-nextblue-600"
                        // onClick={() => {
                        //     setDialogOpen(true);
                        // }}
                    >
                        Ajouter
                    </Button>
                    <FileImportDialog />
                </div>
            </div>

            {/* <UserList /> */}
            <div className="w-full h-full overflow-auto bg-transparent rounded-md">
                <DataTable
                    ListPerPage={5}
                    isLoading={isLoading}
                    data={ria ? ria : []}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default Identification;
