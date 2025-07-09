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
import { SPMU } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Separator } from "@/components/ui/separator"


export const sppColumns: ColumnDef<SPMU>[] = [
    {
        accessorKey: "noSpmu",
        header: "No SPMU",
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Tanggal Pengajuan",
    //     cell: (row) => {
    //         const date = new Date(row.row.original.createdAt)
    //         return `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
    //     }
    // },
    {
        accessorKey: "spp",
        header: "No SPP",
        cell: ({ row }) => {
            const spp = row.original.spp
            return spp.noSpp
        }
    },

    {
        accessorKey: "status SPMU",
        header: "Status",
        cell: ({ row }) => {
            const spp = row.original
            return spp.status ? "Disetujui" : "Belum disetujui"
        }
    },
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const tanggal = row.original.tanggal
            const date = tanggal ? new Date(tanggal) : undefined
            return date ? date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : "-"
        }
    },
    {
        accessorKey: "biroApproval",
        header: "Biro Approval",
        cell: ({ row }) => {
            const spp = row.original
            return spp.biroApproval ? "Sudah di-Otorisasi" : "Belum di-Otorisasi"
        }
    },
    {
        accessorKey: "wr2Approval",
        header: "Warek 2 Approval",
        cell: ({ row }) => {
            const spp = row.original
            return spp.wr2Approval ? "Sudah di-Otorisasi" : "Belum di-Otorisasi"
        }
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const spmu = row.original
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { userInfo } = useSelector((state: RootState) => state.auth);

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/spmu/${spmu.id}`, {
                            withCredentials: true,
                        }),
                        {
                            loading: "Deleting data...",
                            success: () => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `data deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete data: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete data: ${error.message}`)
                }
            }
            const handleOtorisasiBiro = async () => {
                try {
                    toast.promise(
                        axios.put(`${BASE_URL}/spmu/${spmu.id}/otorisasibiro`, {
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
            const handleStatusWR2 = async () => {
                try {
                    toast.promise(
                        axios.put(`${BASE_URL}/spmu/${spmu.id}/otorisasiwr2`, {
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
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <Separator />
                            <DropdownMenuItem >
                                <button onClick={handleOtorisasiBiro} className="w-full text-left">
                                    {spmu.biroApproval ? "Kembalikan Otorisasi" : "Otorisasi Biro"}
                                </button>
                            </DropdownMenuItem>
                            {/* <Separator /> */}
                            <DropdownMenuItem >
                                <button onClick={handleStatusWR2} className="w-full text-left">
                                    {spmu.wr2Approval ? "Kembalikan Otorisasi" : "Otorisasi WR2"}
                                </button>
                            </DropdownMenuItem>
                            {/* <Separator /> */}
                            <DropdownMenuItem disabled >
                                {/* <Link href={`/spmu/${spmu.tahun}/${userInfo?.unit[0]?.id}/${spmu.periodeSPMUId}/${spmu.id}`} className="w-full"> */}
                                    Cetak
                                {/* </Link> */}
                            </DropdownMenuItem>
                            {/* <Separator /> */}
                            <AlertDialogTrigger disabled className="w-full">
                                <DropdownMenuItem disabled >
                                    Delete SPP
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your data
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        },
    },
]