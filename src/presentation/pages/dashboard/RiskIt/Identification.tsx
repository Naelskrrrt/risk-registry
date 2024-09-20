import { useFetchCategory } from "@/hooks/RIA/useFetchRIA";
import {
    useExportToExcelRit,
    useFetchFilteredRIT,
} from "@/hooks/RIT/useFetchRit";
import { useFetchStackholder } from "@/hooks/Users/useFetchUsers";
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
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Stackholder } from "../Admin/constant/constant";
import { columns } from "./ColumnIdentification";
import { Category, RiskIT } from "./types";
import { start } from "repl";

const ItIdentification = () => {
    const [search, setSearch] = useState<string>("");
    const [dateRange, dateRangeSet] = useState<string>();
    const [stackholder, setStackholder] = useState<number>();
    const [riskStrategy_state, setRiskStrategyState] = useState<string>();
    const [level_state, setLevel] = useState<string>();
    const [category_state, setCategoryState] = useState<number>();

    const LEVEL = ["low", "medium", "high"];
    const RISK_STRATEGY = ["Tolerate", "Treat", "Transfer", "Terminate"];

    const {
        data: rit,
        isLoading,
        refetch,
        error,
    } = useFetchFilteredRIT({
        search,
        stackholder,
        date: dateRange,
        level: level_state,
        risk_strategy: riskStrategy_state,
        category: category_state,
    });

    const { mutate: exportToExcel, isPending: waitExport } =
        useExportToExcelRit({
            search,
            stackholder,
            date: dateRange,
            level: level_state,
            risk_strategy: riskStrategy_state,
            category: category_state,
        });

    if (error instanceof AxiosError) {
        toast.error("Erreur", {
            description: error?.response?.data.message as string,
        });
    }

    const { data: stackholders, isPending } = useFetchStackholder();
    const { data: categories, isPending: categoryPending } = useFetchCategory();

    const resetFilters = () => {
        setSearch("");
        // setRole(undefined);
        // setSubprocess(undefined);
        setCategoryState(undefined);
        setLevel("");
        setRiskStrategyState(undefined);
        setStackholder(undefined);
        dateRangeSet("");
    };

    const refreshData = async () => {
        try {
            resetFilters();
            dateRangeSet({
                start: "",
                end: "",
            });
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
                                            Risk Strategy
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Nested menu"
                                        className="max-h-96 overflow-y-auto">
                                        {/* return stack?.id ===
                                                                  stackholder
                                                                  ? setStackholder(
                                                                        undefined
                                                                    )
                                                                  : setStackholder(
                                                                        stack?.id
                                                                    ); */}
                                        {RISK_STRATEGY?.map(
                                            (riskStrategy: string) => (
                                                <DropdownItem
                                                    className={
                                                        riskStrategy ===
                                                        riskStrategy_state
                                                            ? "bg-primary text-white"
                                                            : ""
                                                    }
                                                    key={riskStrategy}
                                                    onClick={() => {
                                                        return riskStrategy ===
                                                            riskStrategy_state
                                                            ? setRiskStrategyState(
                                                                  undefined
                                                              )
                                                            : setRiskStrategyState(
                                                                  riskStrategy
                                                              );
                                                    }}>
                                                    {riskStrategy}
                                                </DropdownItem>
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
                            <DropdownItem key="subprocess" className="">
                                <Dropdown placement="right-start">
                                    <DropdownTrigger className="p-0 ">
                                        <Button
                                            variant="flat"
                                            className="text-left w-full bg-transparent flex justify-start gap-5 pl-2"
                                            startContent={
                                                <Icon
                                                    icon={"solar:file-outline"}
                                                />
                                            }>
                                            Category
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu aria-label="subprocess">
                                        {categoryPending ? (
                                            <DropdownItem className="flex flex-col items-center justify-center">
                                                <Icon
                                                    icon="eos-icons:three-dots-loading"
                                                    // spin={true}
                                                    fontSize={32}
                                                />
                                            </DropdownItem>
                                        ) : (
                                            categories?.map(
                                                (category: Category) => (
                                                    <DropdownItem
                                                        className={
                                                            category.id ===
                                                            category_state
                                                                ? "bg-primary text-white"
                                                                : ""
                                                        }
                                                        key={category.id}
                                                        onClick={() => {
                                                            return category.id ===
                                                                category_state
                                                                ? setCategoryState(
                                                                      undefined
                                                                  )
                                                                : setCategoryState(
                                                                      category.id
                                                                  );
                                                        }}>
                                                        {category.name}
                                                    </DropdownItem>
                                                )
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
                        title="Rafraichir les données"
                        className="relative">
                        <Icon icon={"solar:refresh-outline"} fontSize={22} />
                    </Button>

                    <Button
                        isIconOnly={true}
                        children={<Icon icon="solar:download-linear" />}
                        className="text-white bg-slate-950 text-lg font-bold rounded-lg hover:bg-slate-900"
                        onClick={() => exportToExcel()}
                        disabled={waitExport}
                        isLoading={waitExport}
                        title="Exporter les données"
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
                        data={rit ? rit : []}
                        columns={columns as ColumnDef<RiskIT>[]}
                    />
                )}
            </div>
        </div>
    );
};

export default ItIdentification;
