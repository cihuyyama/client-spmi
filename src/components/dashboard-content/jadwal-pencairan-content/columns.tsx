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
import { Jadwal, JadwalPencairan } from "@/lib/types"


export const jadwalPencairanColumn: ColumnDef<JadwalPencairan>[] = [
    {
        accessorKey: "unit.name",
        header: "Unit Kerja",
    },
    {
        accessorKey: "tahun",
        header: "Tahun",
    },
    {
        accessorKey: "batasKegiatan",
        header: "Batas Kegiatan",
    },
    {
        accessorKey: "tunggakanSPJ",
        header: "Tunggakan SPJ",
    },
    {
        accessorKey: "PeriodeSPMU",
        header: "Total Periode SPMU",
        cell: ({ row }) => {
            const jadwal = row.original
            const totalPeriodeSPMU = jadwal.PeriodeSPMU.length
            return `${totalPeriodeSPMU}`
        }
    },
    {
        accessorKey: "PeriodeSPMU",
        header: "Periode SPMU saat ini",
        cell: ({ row }) => {
            const jadwal = row.original
            const now = new Date()
            let hasPeriode = false
            let periodeNow = new Date()
            jadwal.PeriodeSPMU.forEach((periode) => {
                const endDate = new Date(periode.endDatePengajuan)
                const startDate = new Date(periode.startDatePengajuan)
                if (endDate > now && startDate < now) {
                    periodeNow = new Date(periode.periode)
                    hasPeriode = true
                }
            })

            return (
                <div>
                    {hasPeriode ?
                        periodeNow.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
                        :
                        "Tidak ada periode"
                    }
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const jadwal = row.original

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/jadwal-pencairan/${jadwal.id}`, {
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
                                <Link href={`/mata-rekening/${jadwal.id}`} className="w-full">
                                    Atur Jadwal
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem>
                                    Delete Jadwal
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