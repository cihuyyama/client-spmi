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
import { MoreHorizontal } from "lucide-react"
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
import { Rekening } from "@/lib/types"


export const jenisRekeningColumn: ColumnDef<Rekening>[] = [
    {
        accessorKey: "code",
        header: "Kode Jenis Rekening",
    },
    {
        accessorKey: "name",
        header: "Nama Jenis Rekening",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (row) => {
            const date = new Date(row.row.original.createdAt)
            return `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: (row) => {
            const date = new Date(row.row.original.updatedAt)
            return `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })}`
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const rekening = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/jenis-rekening/${rekening.id}`, {
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
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled>
                                <Link href={`/mata-rekening/${rekening.id}`} className="w-full">
                                    Detail Jenis Rekening
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem>
                                    Delete Jenis Rekening
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