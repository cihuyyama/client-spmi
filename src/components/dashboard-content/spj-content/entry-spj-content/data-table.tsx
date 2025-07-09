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
import React, { Dispatch, SetStateAction } from "react"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux"
import { JadwalPencairan, Pembelian, PeriodeSPMU } from "@/lib/types"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    selectedYear?: string
    selectedUnit?: string
    setSelectedYear: Dispatch<SetStateAction<string | undefined>>
    setSelectedUnit: Dispatch<SetStateAction<string>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSelectedYear,
    setSelectedUnit,
    selectedYear,
    selectedUnit,
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
    // @ts-ignore
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const thisYear = new Date().getFullYear()
    const unitData = userInfo?.unitData ?? []
    console.log(data)

    return (
        <div>
            <div className="flex flex-col w-full items-start py-4 gap-4 ">
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <Select
                                defaultValue={selectedYear}
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
                                defaultValue={selectedUnit}
                            >
                                <Label className="mb-2 pl-1">
                                    Unit Kerja
                                </Label>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter by Unit Kerja" />
                                </SelectTrigger>
                                <SelectContent>
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
                            table.getRowModel().rows.map((row, irow) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-none"
                                    >
                                        {row.getVisibleCells().map((cell, icell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                    {/* {
                                        <Table className="bg-red-300">
                                            <TableHeader>
                                                <TableHead>Uraian</TableHead>
                                                <TableHead>Jumlah</TableHead>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    (data[irow] as { Pembelian: Pembelian[] }).Pembelian.map((pembelian: Pembelian) => (
                                                        <TableRow key={pembelian.id}>
                                                            <TableCell key={pembelian.id} className="border-b">
                                                                {pembelian.uraian}
                                                            </TableCell>
                                                            <TableCell key={pembelian.id} className="border-b">
                                                                {pembelian.jumlah}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    } */}
                                </>
                            )

                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )
                        }

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
