"use client";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import React, { Dispatch, SetStateAction } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selectedYear?: string;
  selectedUnit: string;
  setSelectedYear: Dispatch<SetStateAction<string>>;
  setSelectedUnit: Dispatch<SetStateAction<string>>;
}

export function AuditTable<TData, TValue>({
  columns,
  data,
  selectedYear,
  selectedUnit,
  setSelectedUnit,
  setSelectedYear,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const unitData = userInfo?.unitData ?? [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  const thisYear = new Date().getFullYear();

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div>
          <Label className="mb-2 block">Unit</Label>
          <Select
            onValueChange={setSelectedUnit}
            defaultValue={selectedUnit}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Unit" />
            </SelectTrigger>
            <SelectContent>
              {unitData.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Tahun</Label>
          <Select
            onValueChange={setSelectedYear}
            defaultValue={selectedYear}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Pilih Tahun" />
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
      </div>
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[2000px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24">
                    No data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
