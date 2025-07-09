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
import { BookText, FileX, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL, BASE_URL_FILE } from "@/constant/BaseURL"
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
import { Files, MatoIndicator, SPMU, SPP } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSelector } from "react-redux"


export const dokumenColumn: ColumnDef<Files>[] = [
    {
        header: "No",
        cell: ({ row }) => {
            return row.index + 1
        }
    },
    {
        accessorKey: "originalName",
        header: "Nama File",
        cell: ({ row }) => {
            const file = row.original
            return (
                <div className="flex items-center gap-2">
                    <BookText size={20} />
                    <a href={`${BASE_URL_FILE}/public/filename/${file.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {file.originalName}
                    </a>
                </div>
            )
        }
    },
    {
        accessorKey: "size",
        header: "Ukuran File",
        cell: ({ row }) => {
            const size = Number(row.original.size) / 1024 / 1024
            if (size < 1) {
                return `${(size * 1024).toFixed(2)} KB`
            } else if (size > 1000) {
                return `${(size / 1024).toFixed(2)} GB`
            }
            return `${size.toFixed(2)} MB`
        }
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const dokumen = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/entry-progres/dokumen/${dokumen.id}`, {
                            withCredentials: true,
                        }),
                        {
                            loading: "deleting data...",
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
                <>
                    <AlertDialog>
                        <TooltipProvider>
                            <Tooltip>
                                <AlertDialogTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <button className="w-full text-left text-red-500">
                                            <FileX />
                                        </button>
                                    </TooltipTrigger>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>


                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                <TooltipContent>
                                    <p>Hapus File</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialog >
                </>

            )
        }
    },
]