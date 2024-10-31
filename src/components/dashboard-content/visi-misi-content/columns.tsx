import { Role, Unit, VisiMisi } from "@/lib/types"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/constant/BaseURL"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
export const vmColumn: ColumnDef<VisiMisi>[] = [
    {
        accessorKey: "unitData",
        header: "Unit Name",
        cell: (row) => {
            const role = row.row.original
            return role.unitData?.name || ""
        },
        filterFn: (row, columnId, filterValue) => {
            const unitData = row.getValue(columnId);
            const unitName = (unitData as Unit)?.name || "";
            return filterValue ? unitName === filterValue : true;
        }
    },
    {
        accessorKey: "tahun",
        header: "Tahun",
    },
    {
        accessorKey: "visi",
        header: "Visi",
    },
    {
        accessorKey: "misi",
        header: "Misi",
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
            const vm = row.original
            const encryptedId = Buffer.from(vm.id.toString()).toString('base64')
            const decryptedId = Buffer.from(encryptedId, 'base64').toString('ascii')

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios({
                            method: 'DELETE',
                            url: `${BASE_URL}/visi-misi/${vm.id}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            withCredentials: true,
                            // Disable automatic response parsing
                            transformResponse: [(data) => data], // Fetch doesn't auto-parse the response
                        }),
                        {
                            loading: "Deleting visi-misi...",
                            success: (data) => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `visi-misi deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete visi-misi: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete visi-misi: ${error.message}`)
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
                            <DropdownMenuItem>
                                <Link className="w-full" href={`/visi-misi/${vm.id}`}>
                                    Detail visi-misi
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem>
                                    Delete visi-misi
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