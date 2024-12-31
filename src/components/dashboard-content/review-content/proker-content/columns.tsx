import { ColumnDef } from "@tanstack/react-table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Eraser, Eye, MoreHorizontal, ShoppingBag } from "lucide-react"
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
import { MataAnggaran, MatoIndicator } from "@/lib/types"


export const maColumn: ColumnDef<MatoIndicator>[] = [
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
        header: "Uraian Kegiatan",
    },
    {
        accessorKey: "output",
        header: "Output",
    },
    {
        accessorKey: "waktu",
        header: "Waktu",
        cell: (row) => {
            const startDate = new Date(row.row.original.startDate)
            const endDate = new Date(row.row.original.endDate)

            return `${startDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })} - ${endDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        accessorKey: "Pembelian",
        header: "Jumlah Anggaran (Rupiah)",
        cell: (row) => {
            const pembelian = row.row.original.Pembelian
            return `${pembelian.reduce((acc, curr) => acc + curr.jumlah, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const matoIndicator = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/ma-to-indicator/${matoIndicator.id}`, {
                            withCredentials: true,
                        }),
                        {
                            loading: "Deleting user...",
                            success: () => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `User deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete user: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete user: ${error.message}`)
                }
            }

            return (
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <Link href={`/review/${matoIndicator.kpiId}/proker/${matoIndicator.id}/belanja`}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">belanja</span>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                            </Link>
                            <TooltipContent>
                                <p>Data Belanja</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AlertDialog>
                        <TooltipProvider>
                            <Tooltip>
                                <AlertDialogTrigger>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-red-500">
                                            <span className="sr-only">belanja</span>
                                            <Eraser className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                </AlertDialogTrigger>
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
                                <TooltipContent>
                                    <p>Delete Mata Anggaran Dari Indikator</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialog>
                    {/* <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Link href={`/indicator/${matoIndicator.kpiId}/ma-to-indicator/${matoIndicator.id}/belanja`} className="w-full">
                                        Data Belanja
                                    </Link>
                                </DropdownMenuItem>
                                <AlertDialogTrigger className="w-full">
                                    <DropdownMenuItem>
                                        Delete Mata Anggaran Dari Indikator
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
                    </AlertDialog> */}
                </div>
            )
        },
    },
]