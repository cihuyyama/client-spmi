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
import { SPP } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Separator } from "@/components/ui/separator"


export const sppColumns: ColumnDef<SPP>[] = [
    {
        accessorKey: "noSpp",
        header: "No SPP",
    },
    {
        accessorKey: "createdAt",
        header: "Tanggal Pengajuan",
        cell: (row) => {
            const date = new Date(row.row.original.createdAt)
            return `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        accessorKey: "MaOnKpi",
        header: "Jumlah SPP",
        cell: ({ row }) => {
            const spp = row.original.MaOnKpi
            const jumlahAnggaran = spp.reduce((acc, curr) => acc + curr.anggaran, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            return `${jumlahAnggaran}`
        }
    },
    {
        accessorKey: "otorisasi",
        header: "Otorisasi",
        cell: ({ row }) => {
            const spp = row.original
            return spp.otorisasi ? "Sudah di-Otorisasi" : "Belum di-Otorisasi"
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const spp = row.original
            return spp.status ? "Disetujui" : "Belum disetujui"
        }
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const spp = row.original
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { userInfo } = useSelector((state: RootState) => state.auth);

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/spp/${spp.id}`, {
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
            const handleOtorisasi = async () => {
                try {
                    toast.promise(
                        axios.put(`${BASE_URL}/spp/${spp.id}/otorisasi`, {
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
            const handleStatus = async () => {
                try {
                    toast.promise(
                        axios.put(`${BASE_URL}/spp/${spp.id}/status`, {
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
                                <button onClick={handleOtorisasi} className="w-full text-left">
                                    {spp.otorisasi ? "Kembalikan Otorisasi" : "Otorisasikan"}
                                </button>
                            </DropdownMenuItem>
                            {/* <Separator /> */}
                            <DropdownMenuItem >
                                <button onClick={handleStatus} className="w-full text-left">
                                    {spp.status ? "Ubah Status Setuju" : "Ubah Status Belum Setuju"}
                                </button>
                            </DropdownMenuItem>
                            {/* <Separator /> */}
                            <DropdownMenuItem >
                                <Link href={`/spp/${spp.tahun}/${userInfo?.unit[0]?.id}/${spp.periodeSPMUId}/${spp.id}`} className="w-full">
                                    Tampilkan
                                </Link>
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