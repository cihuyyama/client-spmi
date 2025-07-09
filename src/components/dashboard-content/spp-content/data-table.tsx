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
import { JadwalPencairan, PeriodeSPMU } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    selectedYear?: string
    selectedUnit?: string
    selectedPeriode?: string
    setSelectedYear: Dispatch<SetStateAction<string | undefined>>
    setSelectedUnit: Dispatch<SetStateAction<string>>
    setSelectedPeriode: Dispatch<SetStateAction<string | undefined>>
    jadwalPencarian?: JadwalPencairan
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSelectedYear,
    setSelectedUnit,
    setSelectedPeriode,
    selectedYear,
    selectedUnit,
    selectedPeriode,
    jadwalPencarian,
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
    // const startDate = new Date(jadwalPencarian?.PeriodeSPMU.find((periode) => periode.id === selectedPeriode)?.startDatePengajuan)
    console.log(jadwalPencarian)
    const startDate = jadwalPencarian?.PeriodeSPMU.find((periode) => periode.id === selectedPeriode)?.startDatePengajuan
    const endDate = jadwalPencarian?.PeriodeSPMU.find((periode) => periode.id === selectedPeriode)?.endDatePengajuan
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : ""
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : ""


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

                    <div className="flex flex-col">
                        <div className="flex flex-col w-fit">
                            <Select
                                onValueChange={(value) => setSelectedPeriode(value)}
                                defaultValue={selectedPeriode}
                            >
                                <Label className="mb-2 pl-1">
                                    Periode SPMU
                                </Label>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Filter by Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jadwalPencarian?.PeriodeSPMU?.map((periode: PeriodeSPMU) => (
                                        <SelectItem key={periode.id} value={periode.id}>
                                            {
                                                `${periode.periode}`
                                            }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                </div>

                {selectedPeriode && (
                    <Link href={`/spp/new/${selectedYear}/${selectedPeriode}/${selectedUnit}`}>
                        <Button variant={"default"} className="bg-green-500">
                            <Plus /> Tambah SPP
                        </Button>
                    </Link>

                )}

                {selectedPeriode && (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-4">
                            <span className="text-sm">
                                Batas Kegiatan : {jadwalPencarian?.batasKegiatan}
                            </span>
                            <span className="text-sm">
                                Tunggakan SPJ : {jadwalPencarian?.tunggakanSPJ}
                            </span>
                        </div>
                        <span className="text-xs text-red-400">
                            {jadwalPencarian?.PeriodeSPMU?.length === 0 ? "Tidak ada periode SPMU"
                                :
                                `Tanggal Pengajuan SPP : ${formattedStartDate} s/d ${formattedEndDate}`
                            }
                        </span>
                    </div>
                )}
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
