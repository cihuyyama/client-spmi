/* eslint-disable react-hooks/rules-of-hooks */
import { Indicator, Role, Unit } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
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
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/constant/BaseURL"
import { Button } from "@/components/ui/button"
import { BookText, Eraser, Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
export const indicatorColumn: ColumnDef<Indicator>[] = [
    {
        accessorKey: "kpiCode",
        header: "Kode",
    },
    {
        accessorKey: "name",
        header: "Nama Indikator Kinerja",
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
        accessorKey: "MaOnKpi.Pembelian",
        header: "Jumlah Anggaran (Rupiah)",
        cell: ({ row }) => {
            const proker = row.original.MaOnKpi
            const jumlahAnggaran = proker.reduce((acc, curr) => acc + curr.Pembelian.reduce((acc, curr) => acc + curr.jumlah, 0), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            return `${jumlahAnggaran}`
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const indicator = row.original
            const encryptedId = Buffer.from(indicator.id.toString()).toString('base64')
            const decryptedId = Buffer.from(encryptedId, 'base64').toString('ascii')
            const { userInfo } = useSelector((state: RootState) => state.auth);

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios({
                            method: 'DELETE',
                            url: `${BASE_URL}/indicator/${indicator.id}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            withCredentials: true,
                            // Disable automatic response parsing
                            transformResponse: [(data) => data], // Fetch doesn't auto-parse the response
                        }),
                        {
                            loading: "Deleting indicator...",
                            success: (data) => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `indicator deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete indicator: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete indicator: ${error.message}`)
                }
            }

            return (
                <div>
                    {/* {userInfo?.role?.permissions.map(permission => permission.name).includes("VIEW_PROGRAM_KERJA") && ( */}
                        <TooltipProvider>
                            <Tooltip>
                                <Link href={`/review/${indicator.id}/proker`}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">detail</span>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                </Link>
                                <TooltipContent>
                                    <p>Program Kerja</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    {/* )} */}
                </div>
            )
        },
    },
]