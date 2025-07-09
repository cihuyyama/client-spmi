import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BookText, MoreHorizontal, Pencil } from "lucide-react"
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
import { MatoIndicator, SPMU, SPP } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSelector } from "react-redux"


export const sppColumns: ColumnDef<MatoIndicator>[] = [
    {
        header: "No",
        cell: ({ row }) => {
            return row.index + 1
        }
    },
    {
        accessorKey: "SPP.SPMU.noSpmu",
        header: "No SPMU",
    },
    {
        accessorKey: "SPP.SPMU.tanggal",
        header: "Tgl SPMU",
        cell: ({ row }) => {
            const tanggal = row.original.SPP?.SPMU.tanggal
            const tglSPMU = tanggal ? new Date(tanggal) : undefined
            
            return `${tglSPMU?.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        accessorKey: "MA.maCode",
        header: "Kode MA",
    },
    {
        accessorKey: "uraian",
        header: "Uraian",
    },
    {
        accessorKey: "anggaran",
        header: "Nominal SPP",
        cell: ({ row }) => {
            const proker = row.original
            return proker.anggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    },
    {
        accessorKey: "",
        header: "No SPJ",
    },
    {
        accessorKey: "SPJ.createdAt",
        header: "Tgl SPJ",
        cell: ({ row }) => {
            const tanggal = row.original.SPJ?.createdAt
            const tglSPMU = tanggal ? new Date(tanggal) : undefined
            
            return `${tglSPMU ? tglSPMU.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : ''}`
        }
    },
    {
        accessorKey: "SPJ.nominalSPJ",
        header: "Nominal SPJ",
        cell: ({ row }) => {
            const nominalSPJ = row.original.SPJ?.nominalSPJ
            return nominalSPJ?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
                            <Link href={`/spj/entry-spj/${proker.id}`} className="w-full">
                                <Button variant="link" >
                                    {proker.SPJ?.statusPersetujuanBiro ? (<span className="text-blue-500">Detail</span>) : (<span className="text-blue-500">Ajukan SPJ</span>)}
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Detail Progres SPJ</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            )
        }
    },
]