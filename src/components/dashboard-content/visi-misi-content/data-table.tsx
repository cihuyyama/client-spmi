"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"

interface UnitData {
    name: string;
}

interface TData {
    unitData: UnitData;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setSelectedYear: Dispatch<SetStateAction<string | undefined>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSelectedYear,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnFilters,
        }
    })
    const uniqueUnits = data.filter((unit, index, self) =>
        // @ts-ignore
        index === self.findIndex((u) => u.unitData.id === unit.unitData.id)
    );
    const thisYear = new Date().getFullYear()

    return (
        <div>
            <div className="flex flex-col w-full items-start py-4 gap-4 ">
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <Select
                                defaultValue={thisYear.toString()}
                                onValueChange={(value) => setSelectedYear(value)}
                            >
                                <Label className="mb-2 pl-1">
                                    Tahun
                                </Label>
                                <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="Filter by Unit Kerja" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <SelectItem key={i} value={String((thisYear + 1) - i)}>
                                            {(thisYear + 1) - i}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col w-full">
                            <Select
                                defaultValue="all"
                                onValueChange={(value) => table.getColumn("unitData")?.setFilterValue(value === "all" ? undefined : value)}
                            >
                                <Label className="mb-2 pl-1">
                                    Unit Kerja
                                </Label>
                                <SelectTrigger className="min-w-[200px] w-fit">
                                    <SelectValue placeholder="Filter by Unit Kerja" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Unit</SelectItem>
                                    {uniqueUnits.map((unit: any) => (
                                        <SelectItem key={unit.unitData.id} value={unit.unitData.name}>
                                            {unit.unitData.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>



                </div>
                    <Link href={"/visi-misi/new"}>
                        <Button variant={"default"} className="bg-green-500">
                            <Plus /> Tambah Visi Misi
                        </Button>
                    </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
