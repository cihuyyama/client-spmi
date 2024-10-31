import { Badge } from "@/components/ui/badge"
import { Role } from "@/lib/types"
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

export const roleColumn: ColumnDef<Role>[] = [
    {
        accessorKey: "name",
        header: "Role Name",
    },
    {
        accessorKey: "permissions",
        header: "Permissions",
        cell: (row) => {
            const role = row.row.original
            return (
                <div>
                    {role.permissions.map((permission) => (
                        <span key={permission.id} className="mr-2">
                            <Badge className="bg-green-600">
                                {permission.name}
                            </Badge>
                        </span>
                    ))}
                </div>
            )
        }
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
            const role = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios({
                            method: 'DELETE',
                            url: `${BASE_URL}/roles/${role.id}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            withCredentials: true,
                            // Disable automatic response parsing
                            transformResponse: [(data) => data], // Fetch doesn't auto-parse the response
                        }),
                        {
                            loading: "Deleting role...",
                            success: (data) => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)

                                return `role ${role.name} deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete role: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete role: ${error.message}`)
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
                                <Link className="w-full" href={`/roles/${role.id}`}>
                                    Detail Role
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem>
                                    Delete role
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