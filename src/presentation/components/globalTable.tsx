"use client";

import { Pagination } from "@nextui-org/pagination";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table";
import { Button } from "@nextui-org/button";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/dropdown";
import { useLocation } from "react-router-dom";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    ListPerPage?: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    // isLoading,
    ListPerPage,
}: DataTableProps<TData, TValue>) {
    // Gestion de la sélection des colonnes visibles
    const [visibleColumns, setVisibleColumns] = useState<
        ColumnDef<TData, TValue>[]
    >(
        columns.filter(
            (column) => column.id === "action" || columns.indexOf(column) < 8
        )
    );

    const toggleColumnVisibility = (column: ColumnDef<TData, TValue>) => {
        if (column.id === "action") {
            return;
        }
        if (visibleColumns.includes(column)) {
            setVisibleColumns(visibleColumns.filter((col) => col !== column));
        } else {
            setVisibleColumns([...visibleColumns, column]);
        }
    };

    const table = useReactTable({
        data,
        columns: visibleColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: ListPerPage } },
    });

    useEffect(() => {
        const initialSelectedKeys = new Set(
            visibleColumns.map((col) => col?.id as string)
        );

        console.table(visibleColumns);
        setSelectedKeys(initialSelectedKeys);
    }, [visibleColumns]);

    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
        new Set()
    );
    const location = useLocation();

    // const selectedValue = React.useMemo(
    //     () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    //     [selectedKeys]
    // );

    return (
        <div className="rounded-md border h-full w-full relative">
            {/* Section de sélection des colonnes */}
            {location.pathname === "/dashboard/admin" ? (
                ""
            ) : (
                <div className="p-4 w-full h-fit relative flex justify-end ">
                    <Dropdown suppressHydrationWarning>
                        <DropdownTrigger>
                            <Button
                                variant="flat"
                                color="primary"
                                title="Selection de colonne">
                                Colonnes à Afficher
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            color="primary"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            closeOnSelect={false}
                            suppressHydrationWarning
                            className="h-fit overflow-y-auto w-full flex flex-col gap-2"
                            classNames={{
                                list: "w-full grid grid-cols-3 gap-2 p-2",
                            }}
                            disabledKeys={["action"]}
                            // onSelectionChange={setSelectedKeys}
                        >
                            {columns.map((column) => (
                                <DropdownItem
                                    classNames={{}}
                                    key={column.id}
                                    onClick={() =>
                                        toggleColumnVisibility(column)
                                    }>
                                    {column.header as string}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            )}

            {/* Table de données */}
            <Table className="border w-full min-w-full">
                <TableHeader className="bg-nextblue-50 font-bold sticky top-0 text-nextblue-500 hover:bg-nextblue-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="bg-nextblue-100">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    className="text-nextblue-500"
                                    key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="max-h-[500px] overflow-y-auto">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="relative w-full">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="min-w-32">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div
                className={`flex justify-center p-2 absolute ${
                    location.pathname === "/dashboard/admin"
                        ? "bottom-2 w-full"
                        : "top-2 left-3"
                }  opacity-50 hover:opacity-100`}>
                <Pagination
                    showControls
                    total={table.getPageCount()}
                    initialPage={table.getState().pagination.pageIndex + 1}
                    onChange={(page) => table.setPageIndex(page - 1)}
                />
            </div>
        </div>
    );
}
