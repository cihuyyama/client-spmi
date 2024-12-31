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
import { Textarea } from '@/components/ui/textarea'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Indicator } from '@/lib/types'

export default function HasilReviewUmum({ tahun, unitId, review, tanggapan, id, indicator }: { tahun: string, unitId: string, review: string, tanggapan: string, id?: string, indicator?: Indicator[] }) {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const roleReviewer = userInfo?.role?.permissions.map(permission => permission.name).includes("REVIEWER")
    let checkSarandanTemuan: number[] = [];
    indicator?.map((kpi)=> {
        kpi.MaOnKpi.map((proker)=> {
            if ((!proker.ReviewProgram.saran || !proker.ReviewProgram.temuan) ) {
                checkSarandanTemuan.push(1)
            } else {
                checkSarandanTemuan.push(1)
            }
        })
    })
    
    
    const formSchema = z.object({
        tahun: z.string({
            required_error: "Jadwal Id is required"
        }),
        unitId: z.string({
            required_error: "Unit Id is required"
        }),
        reviewUmun: z.string({
            required_error: "Review Umum is required"
        }).optional(),
        tanggapanAkhir: z.string({
            required_error: "Tanggapan Akhir is required"
        }).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: tahun,
            unitId: unitId,
            reviewUmun: "",
            tanggapanAkhir: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/review?id=${id ?? ''}`, {
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
        form.setValue("tahun", tahun)
        form.setValue("unitId", unitId)
        form.setValue("reviewUmun", review)
        form.setValue("tanggapanAkhir", tanggapan)
    }, [form, tahun, unitId, review, tanggapan])
    return (
        <>
            <h1 className="text-xl font-semibold">
                Review Umum
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="w-full md:min-w-[400px] space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="reviewUmun"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hasil Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="review" {...field} disabled={!roleReviewer} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tanggapanAkhir"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggapan Unit Kerja</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="tanggapan"
                                            {...field}
                                            value={field.value}
                                            disabled={
                                                roleReviewer
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={
                            userInfo?.unit[0].Jadwal.name != 'review'
                        }
                    >
                        Submit
                    </Button>

                </form>
                {userInfo?.unit[0].Jadwal.name != 'review' && (
                    <span className='text-sm font-semibold text-red-400'>
                        *Anda tidak bisa submit tanggapan karena jadwal review belum dimulai
                    </span>
                )}
            </Form>
        </>
    )
}