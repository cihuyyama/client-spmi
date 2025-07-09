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
        accessorKey: "uraian",
        header: "Nama Kegiatan",
    },
    {
        accessorKey: "anggaran",
        header: "Jumlah Anggaran(Rp)",
        cell: ({ row }) => {
            const proker = row.original
            return proker.anggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    },
    {
        header: "Waktu",
        cell: ({ row }) => {
            const startDate = new Date(row.original.startDate)
            const endDate = new Date(row.original.endDate)

            return `${startDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })} - ${endDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        accessorKey: "ProgresSpj",
        header: "Progres BPM",
        cell: ({ row }) => {
            const proker = row.original
            return proker.ProgresSpj?.statusPenilaianBPM
        }
    },
    {
        accessorKey: "ProgresSpj",
        header: "Approval BPM",
        cell: ({ row }) => {
            const proker = row.original
            return proker.ProgresSpj?.statusApprovalBPM
        }
    },
    {
        accessorKey: "ProgresSpj",
        header: "Status BPM",
        cell: ({ row }) => {
            const proker = row.original
            return proker.ProgresSpj?.uraianPenilaianBPM
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
                            <Link href={`/spj/progres/${proker.id}`} className="w-full">
                                <Button variant="link" >
                                    {proker.ProgresSpj?.uraianKegiatan ? (<span>ubah</span>) : (<span>tambah</span>)}
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