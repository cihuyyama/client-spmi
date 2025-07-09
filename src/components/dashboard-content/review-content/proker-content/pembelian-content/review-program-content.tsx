import { BASE_URL } from '@/constant/BaseURL'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

const formSchema = z.object({
    prokerId: z.string({
        required_error: "Proker Id is required"
    }),
    temuan: z.string({
        required_error: "Temuan is required"
    }).optional(),
    saran: z.string({
        required_error: "Saran is required"
    }).optional(),
    tanggapan: z.string({
        required_error: "Tanggapan is required"
    }).optional(),
    reviewAkhir: z.string({
        required_error: "Review Akhir is required"
    }).optional(),
    rekomendasi: z.string({
        required_error: "Rekomendasi is required"
    }).optional(),
})

const options = [
    { label: "Direkomendasikan", value: "Direkomendasikan" },
    { label: "Perlu Perbaikan", value: "Perlu Perbaikan" },
    { label: "Tidak Direkomendasikan", value: "Tidak Direkomendasikan" },
];

export type CreateReviewProgramInput = z.infer<typeof formSchema>;

export default function ReviewProker(
    { reviewProker }: { reviewProker: CreateReviewProgramInput },
) {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const roleReviewer = userInfo?.role?.permissions.map(permission => permission.name).includes("REVIEWER") || userInfo?.role?.permissions.map(permission => permission.name).includes("ADMIN_PERENCANAAN")
    const rolePerencana = userInfo?.role?.permissions.map(permission => permission.name).includes("ADMIN_PERENCANAAN")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prokerId: "",
            temuan: "",
            saran: "",
            tanggapan: "",
            reviewAkhir: "",
            rekomendasi: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            toast.promise(
                axios.put(`${BASE_URL}/review-program?id=${reviewProker.prokerId ?? ''}`, {
                    ...values,
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        return `Berhasil menyimpan data`
                    },
                    error: (e) => {
                        return `Gagal menyimpan data: ${e}`
                    }
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        form.setValue("prokerId", reviewProker.prokerId)
        form.setValue("temuan", reviewProker?.temuan)
        form.setValue("saran", reviewProker?.saran)
        form.setValue("tanggapan", reviewProker?.tanggapan)
        form.setValue("reviewAkhir", reviewProker?.reviewAkhir)
        form.setValue("rekomendasi", reviewProker?.rekomendasi)
    }, [form, reviewProker])
    return (
        <>
            <h1 className="text-xl font-semibold">
                Review Program Kerja
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="w-full md:min-w-[400px] space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="temuan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Temuan</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="" disabled={!roleReviewer} {...field} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="saran"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Saran</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="" disabled={!roleReviewer} {...field} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator className='h-[3px]' />
                    <div className="w-full md:min-w-[400px] space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="tanggapan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggapan</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="" disabled={roleReviewer && !rolePerencana} {...field} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reviewAkhir"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Review Akhir</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="" disabled={!roleReviewer} {...field} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="rekomendasi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rekomendasi</FormLabel>
                                <FormControl>
                                    <div className="flex items-center border rounded-md p-2 space-x-2 justify-center">
                                        {options.map((option) => (
                                            <Button
                                                key={option.value}
                                                variant={field.value === option.value ? "default" : "outline"}
                                                disabled={!roleReviewer}
                                                className={`px-4 py-2 ${field.value === option.value
                                                        ? "bg-purple-600 text-white"
                                                        : "text-gray-600"
                                                    }`}
                                                onClick={() => field.onChange(option.value)}
                                                type="button"
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">
                        Simpan
                    </Button>
                </form>
            </Form>
        </>
    )
}