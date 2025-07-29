import { Indicator } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const auditColumns: ColumnDef<Indicator>[] = [
  {
    accessorKey: "kpiCode",
    header: "Kode",
  },
  {
    accessorKey: "name",
    header: "Nama Indikator",
  },
  {
    accessorKey: "sifat",
    header: "Sifat",
  },
  {
    accessorKey: "baseline",
    header: "Baseline",
  },
  {
    accessorKey: "target",
    header: "Target",
  },
  {
    header: "Progress",
    cell: ({ row }) => {
      const laporan = row.original.Laporan || [];
      const progress = laporan.reduce((acc, curr) => acc + curr.capaian, 0);
      return `${progress}`;
    },
  },
  {
    header: "Persen Capaian",
    cell: ({ row }) => {
      const laporan = row.original.Laporan || [];
      const progress = laporan.reduce((acc, curr) => acc + curr.capaian, 0);
      const target = Number(row.original.target);
      return target ? `${((progress / target) * 100).toFixed(2)}%` : "-";
    },
  },
  {
    header: "Capaian",
    cell: ({ row }) => row.original.Laporan?.[0]?.capaian ?? "-",
  },
  {
    header: "Capaian Auditor",
    cell: ({ row }) => row.original.Laporan?.[0]?.capaian_auditor ?? "-",
  },
  {
    header: "Kendala",
    cell: ({ row }) => row.original.Laporan?.[0]?.kendala ?? "-",
  },
  {
    header: "Perbaikan",
    cell: ({ row }) => row.original.Laporan?.[0]?.perbaikan ?? "-",
  },
  {
    header: "RTL",
    cell: ({ row }) => row.original.Laporan?.[0]?.rtl ?? "-",
  },
  {
    header: "PIC",
    cell: ({ row }) => row.original.Laporan?.[0]?.pic ?? "-",
  },
];
