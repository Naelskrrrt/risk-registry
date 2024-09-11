import { ColumnDef } from "@tanstack/react-table";
// import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@nextui-org/button";

interface ColumnSelectorProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    visibleColumns: string[];
    onChange: (selectedColumns: string[]) => void;
}

export function ColumnSelector<TData, TValue>({
    columns,
    visibleColumns,
    onChange,
}: ColumnSelectorProps<TData, TValue>) {
    const handleCheckboxChange = (columnId: string) => {
        let updatedSelection;
        if (visibleColumns.includes(columnId)) {
            updatedSelection = visibleColumns.filter((col) => col !== columnId);
        } else {
            updatedSelection = [...visibleColumns, columnId];
        }
        onChange(updatedSelection);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="ml-auto"> */}
                Columns <ChevronDown className="ml-2 h-4 w-4" />
                {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }>
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
