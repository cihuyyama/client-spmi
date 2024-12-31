import { ColumnDef } from "@tanstack/react-table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Eraser, MoreHorizontal, Pencil } from "lucide-react"
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
import { Pembelian } from "@/lib/types"


export const belanjaColumn: ColumnDef<Pembelian>[] = [
    {
        accessorKey: "rekening.noRek",
        header: "Nomor Rekening",
    },
    {
        accessorKey: "rekening.name",
        header: "Nama Rekening",
    },
    {
        accessorKey: "uraian",
        header: "Uraian Kegiatan",
    },
    {
        accessorKey: "satuan",
        header: "Satuan",
    },
    {
        accessorKey: "nilaiSatuan",
        header: "Nilai Satuan (Rupiah)",
        cell: ({ row }) => {
            const value = row.getValue("nilaiSatuan");
            return value 
                ? `${Number(value).toLocaleString('id-ID', {
                    maximumFractionDigits: 0,
                    useGrouping: true
                }).replace(/,/g, '.')}`
                : '-'
        }
    },
    {
        accessorKey: "kuantitas",
        header: "Kuantitas",
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah (Rupiah)",
        cell: ({ row }) => {
            const value = row.getValue("jumlah");
            return value 
                ? `${Number(value).toLocaleString('id-ID', {
                    maximumFractionDigits: 0,
                    useGrouping: true
                }).replace(/,/g, '.')}`
                : '-'
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const pembelian = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/pembelian/${pembelian.id}`, {
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

            return (
                <div>
                    {/* <TooltipProvider>
                        <Tooltip>
                            <Link href={`/indicator/${pembelian.id}/ma-to-indicator/${pembelian.id}/belanja`}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">belanja</span>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                            </Link>
                            <TooltipContent>
                                <p>Detail Belanja</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> */}
                    {/* <AlertDialog>
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
                                    <p>Delete Belanja</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialog> */}
                </div>
            )
        },
    },
]