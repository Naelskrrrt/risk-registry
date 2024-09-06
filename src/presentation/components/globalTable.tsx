"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "@nextui-org/pagination";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table";
import Loader from "./loader/loader";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    ListPerPage?: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    ListPerPage,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: ListPerPage } },
    });

    return (
        <div className="rounded-md border  h-full relative ">
            <Table className="border w-full min-w-full">
                <TableHeader className="bg-nextblue-50 font-bold text-nextblue-500 hover:bg-nextblue-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className=" bg-nextblue-100">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        className="text-nextblue-500"
                                        key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="">
                    {isLoading ? (
                        <Loader />
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                className="h-full relative w-full overflow-y-auto"
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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

            <div className="flex justify-center p-2 sticky bottom-5 left-0 w-full">
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
