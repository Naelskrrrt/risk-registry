/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useExportToExcelRIA,
    useFetchProcess,
    useFilteredRIA,
} from "@/hooks/RIA/useFetchRIA";
import { useFetchStackholder } from "@/hooks/Users/useFetchUsers";
import { formatDate } from "@/lib/formatDate";
import { DataTable } from "@/presentation/components/globalTable";
import Loader from "@/presentation/components/loader/loader";
import { fetchSubprocess } from "@/services/riaService";
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
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Risk, Stackholder } from "../Admin/constant/constant";
import { columns } from "./ColumnIdentification";

const Identification = () => {
    const [search, setSearch] = useState<string>("");
    const [dateRange, dateRangeSet] = useState<string>();
    const [stackholder, setStackholder] = useState<number>();
    const [process_state, setProcessState] = useState<number>();
    const [level_state, setLevel] = useState<string>();
    const [subprocess_state, setSubprocess] = useState<number>();
    const [subprocess, setSubprocesses] = useState<any[]>([]); // Stocker les sous-processus
    const [subprocessPending, setSubprocessPending] = useState<boolean>(false);
    // search = "",
    // date = "",
    // process = "",
    // subprocess = "",
    // stackholder = null,
    // inherent_risk_level = "",

    const LEVEL = ["low", "medium", "high"];

    const {
        data: ria,
        isLoading,
        refetch,
    } = useFilteredRIA({
        search,
        stackholder,
        subprocess: subprocess_state,
        inherent_risk_level: level_state,
        process: process_state,
        date: dateRange,
    });

    const { mutate: exportToExcel, isPending: waitExport } =
        useExportToExcelRIA({
            search,
            stackholder,
            subprocess: subprocess_state,
            inherent_risk_level: level_state,
            process: process_state,
            date: dateRange,
        });

    const { data: stackholders, isPending } = useFetchStackholder();
    const { data: process, isPending: processPending } = useFetchProcess();
    useEffect(() => {
        const effectFetchSubprocess = async () => {
            if (process_state) {
                setSubprocessPending(true);
                try {
                    const fetchedSubprocess = await fetchSubprocess(
                        process_state
                    ); // Appel API pour récupérer les sous-processus
                    setSubprocesses(fetchedSubprocess); // Mettre à jour l'état avec les sous-processus
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des sous-processus",
                        error
                    );
                } finally {
                    setSubprocessPending(false);
                }
            }
        };

        effectFetchSubprocess();
    }, [process_state]);

    const resetFilters = () => {
        setSearch("");
        // setRole(undefined);
        setSubprocess(undefined);
        setLevel("");
        setProcessState(undefined);
        setStackholder(undefined);
        dateRangeSet("");
    };

    const refreshData = async () => {
        try {
            resetFilters();
            await refetch();

            toast.success("Données rafraîchies", {
                description: "Les données ont été mises à jour avec succès.",
            });
        } catch (error) {
            toast.error("Erreur de rafraîchissement", {
                description:
                    "Impossible de rafraîchir les données. Veuillez réessayer.",
            });
            throw new Error(error as string);
        }
    };
    return (
        <div className="w-full flex h-full relative overflow-hidden py-1 flex-col gap-3 ">
            <div className="w-full  flex justify-between h-fit overflow-x-auto items-center px-2 flex-wrap ">
                <div className="flex gap-2 h-full relative py-1 overflow-visible">
                    <Input
                        startContent={<Icon icon="solar:magnifer-outline" />}
                        placeholder="Search ..."
                        color="primary"
                        size="md"
                        classNames={{
                            input: "rounded-lg w-[250px]",
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateRangePicker
                        label="Filtrer la Date d'ajout"
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
                            <DropdownItem key="process">
                                <Dropdown placement="right-start">
                                    <DropdownTrigger className="p-0 ">
                                        <Button
                                            variant="flat"
                                            className=" text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                            startContent={
                                                <Icon
                                                    icon={
                                                        "solar:folder-with-files-outline"
                                                    }
                                                />
                                            }>
                                            Process
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Nested menu"
                                        className="max-h-96 overflow-y-auto">
                                        {processPending ? (
                                            <DropdownItem className="flex flex-col items-center justify-center">
                                                <Icon
                                                    icon="eos-icons:three-dots-loading"
                                                    // spin={true}
                                                    fontSize={32}
                                                />
                                            </DropdownItem>
                                        ) : (
                                            process?.map(
                                                (proc: {
                                                    id: number;
                                                    name: string;
                                                    description: string;
                                                }) => (
                                                    <DropdownItem
                                                        className={
                                                            proc?.id ===
                                                            process_state
                                                                ? "bg-primary text-white"
                                                                : ""
                                                        }
                                                        key={proc?.id}
                                                        onClick={() => {
                                                            if (
                                                                proc?.id ===
                                                                process_state
                                                            ) {
                                                                setSubprocess(
                                                                    undefined
                                                                );
                                                                setProcessState(
                                                                    undefined
                                                                );
                                                            } else {
                                                                setSubprocess(
                                                                    undefined
                                                                );
                                                                setProcessState(
                                                                    proc?.id
                                                                );
                                                            }
                                                        }}>
                                                        {proc?.name}
                                                    </DropdownItem>
                                                )
                                            )
                                        )}
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                            <DropdownItem key="stackholders">
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

                                        {isPending
                                            ? "Chargement..."
                                            : stackholders?.map(
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
                            <DropdownItem key="level">
                                <Dropdown placement="right-start">
                                    <DropdownTrigger className="p-0 ">
                                        <Button
                                            variant="flat"
                                            className=" text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                            startContent={
                                                <Icon
                                                    icon={
                                                        "solar:chart-2-outline"
                                                    }
                                                />
                                            }>
                                            Inherent Risk Level
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Nested menu">
                                        {LEVEL?.map((level) => (
                                            <DropdownItem
                                                className={
                                                    level === level_state
                                                        ? "bg-primary text-white"
                                                        : ""
                                                }
                                                key={level}
                                                onClick={() => {
                                                    return level ===
                                                        level_state?.toLowerCase()
                                                        ? setLevel(undefined)
                                                        : setLevel(level);
                                                }}>
                                                {level.toLocaleUpperCase()}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownItem>
                            <DropdownItem
                                key="subprocess"
                                className={`${
                                    process_state ? "block" : "hidden"
                                }`}>
                                {process_state && (
                                    <Dropdown placement="right-start">
                                        <DropdownTrigger className="p-0 ">
                                            <Button
                                                variant="flat"
                                                className="text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                                startContent={
                                                    <Icon
                                                        icon={
                                                            "solar:file-outline"
                                                        }
                                                    />
                                                }>
                                                Subprocess
                                            </Button>
                                        </DropdownTrigger>

                                        <DropdownMenu aria-label="subprocess">
                                            {subprocessPending ? (
                                                <DropdownItem className="flex flex-col items-center justify-center">
                                                    <Icon
                                                        icon="eos-icons:three-dots-loading"
                                                        // spin={true}
                                                        fontSize={32}
                                                    />
                                                </DropdownItem>
                                            ) : (
                                                subprocess?.map(
                                                    (sub: {
                                                        id: number;
                                                        process: string;
                                                        name: string;
                                                    }) => (
                                                        <DropdownItem
                                                            className={
                                                                sub.id ===
                                                                subprocess_state
                                                                    ? "bg-primary text-white"
                                                                    : ""
                                                            }
                                                            key={sub.id}
                                                            onClick={() => {
                                                                return sub.id ===
                                                                    subprocess_state
                                                                    ? setSubprocess(
                                                                          undefined
                                                                      )
                                                                    : setSubprocess(
                                                                          sub.id
                                                                      );
                                                            }}>
                                                            <span className="font-bold">
                                                                {sub.process}:
                                                            </span>
                                                            {sub.name}
                                                        </DropdownItem>
                                                    )
                                                )
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                )}
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
                        className="text-white bg-slate-950 text-lg font-bold rounded-lg hover:bg-slate-900"
                        onClick={() => exportToExcel()}
                        disabled={waitExport}
                        title="Exporter les utilisateurs"
                    />
                </div>
            </div>

            {/* <UserList /> */}
            <div className="w-full h-full relative  bg-transparent rounded-md">
                {isLoading ? (
                    <Loader />
                ) : (
                    <DataTable
                        ListPerPage={5}
                        isLoading={isLoading}
                        data={ria ? ria : []}
                        columns={columns as ColumnDef<Risk>[]}
                    />
                )}
            </div>
        </div>
    );
};

export default Identification;
