import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { BookText, MoreHorizontal, Pencil, SquareCheckBig } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/constant/BaseURL"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MatoIndicator } from "@/lib/types"


export const detailSPPColumns: ColumnDef<MatoIndicator>[] = [
    {
        accessorKey: "MA.maCode",
        header: "Kode MA",
    },
    {
        accessorKey: "MA.name",
        header: "Nama MA",
    },
    {
        accessorKey: "uraian",
        header: "Uraian",
    },
    {
        accessorKey: "statusBiroKeu",
        header: "Catatan Biro Keu",
        cell: ({ row }) => {
            const ma = row.original
            return ma.statusBiroKeu ? "Sudah diverifikasi" : "Belum diverifikasi"
        }
    },
    {
        accessorKey: "anggaran",
        header: "Anggaran",
        cell: ({ row }) => {
            const ma = row.original.anggaran
            return `${ma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        }
    },
    {
        accessorKey: "anggaranDiminta",
        header: "Diminta",
        cell: ({ row }) => {
            const ma = row.original
            return `${ma.anggaranDiminta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        }
    },
    {
        header: "Sisa Anggaran",
        cell: ({ row }) => {
            const ma = row.original
            const sisaAnggaran = ma.anggaran - ma.anggaranDiminta
            return `${sisaAnggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        }
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const proker = row.original

            const handleStatus = async () => {
                try {
                    toast.promise(
                        axios.put(`${BASE_URL}/spp/${proker.id}/statusbirokeu`, {
                            withCredentials: true,
                        }),
                        {
                            loading: "saving data...",
                            success: () => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `data saved successfully`
                            },
                            error: (e) => {
                                return `Failed to save data: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to save data: ${error.message}`)
                }
            }

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={handleStatus} disabled={proker.statusBiroKeu} className="w-full text-left">
                                {proker.statusBiroKeu ? "" : (<SquareCheckBig />)}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Verifikasi status biro keuangan</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            )
        }
    },
]