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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setSelectedYear: Dispatch<SetStateAction<string | undefined>>
    setSelectedUnit: Dispatch<SetStateAction<string>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSelectedYear,
    setSelectedUnit,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    // @ts-ignore
    const { userInfo } = useSelector((state: RootState) => state.auth)


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

    const thisYear = new Date().getFullYear()
    const unitData = userInfo?.unitData ?? []

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
                                <SelectTrigger className="max-w-[80px]">
                                    <SelectValue placeholder="Filter by Year" />
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
                                onValueChange={(value) => setSelectedUnit(value)}
                                defaultValue={unitData[0]?.id ?? "all"}
                            >
                                <Label className="mb-2 pl-1">
                                    Unit Kerja
                                </Label>
                                <SelectTrigger className="wfit">
                                    <SelectValue placeholder="Filter by Unit Kerja" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Unit</SelectItem>
                                    {unitData.map((unit: any) => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>



                </div>
                <Link href={"/indicator/new"}>
                    <Button variant={"default"} className="bg-green-500">
                        <Plus /> Tambah Indikator
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
