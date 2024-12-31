"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ReactSelect from 'react-select'
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Indicator, SubUnit, Unit } from "@/lib/types";

export default function DetailIndicatorContent({ id }: { id: string }) {
    const [indicator, setIndicator] = useState<Indicator>();
    const router = useRouter();
    const thisYear = new Date().getFullYear() + 1
    const formSchema = z.object({
        kpiCode: z.string({
            required_error: "Kode KPI harus diisi"
        }),
        name: z.string({
            required_error: "Nama KPI harus diisi"
        }),
        sifat: z.string({
            required_error: "Sifat KPI harus diisi"
        }),
        year: z.string({
            required_error: "Tahun KPI harus diisi"
        }),
        bidangId: z.string({
            required_error: "Bidang KPI harus diisi"
        }),
        primaryPICId: z.string({
            required_error: "PIC Utama KPI harus diisi"
        }),
        standard: z.string({
            required_error: "Standar KPI harus diisi"
        }).optional(),
        baseline: z.string().optional(),
        target: z.string().optional(),
        secondaryPICId: z.string().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kpiCode: indicator?.kpiCode ?? "",
            name: indicator?.name ?? "",
            sifat: indicator?.sifat ?? "",
            year: indicator?.tahun ?? "",
            bidangId: indicator?.bidang.id ?? "",
            primaryPICId: indicator?.primary_pic_id ?? "",
            secondaryPICId: indicator?.secondary_pic_id ?? "",
            standard: indicator?.standard ?? "",
            baseline: indicator?.baseline ?? "",
            target: indicator?.target ?? "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            toast.promise(
                axios.put(`${BASE_URL}/indicator/${id}`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/indicator')
                        }, 300);
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
        const fetchDataIndicator = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/indicator/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setIndicator(response.data.data)
                    form.setValue('kpiCode', response.data.data.kpiCode ?? undefined)
                    form.setValue('name', response.data.data.name ?? undefined)
                    form.setValue('sifat', response.data.data.sifat ?? undefined)
                    form.setValue('baseline', response.data.data.baseline ?? undefined)
                    form.setValue('target', response.data.data.target ?? undefined)
                    form.setValue('year', response.data.data.tahun ?? undefined)
                    form.setValue('standard', response.data.data.standard ?? undefined)
                    form.setValue('bidangId', response.data.data.bidang.id ?? undefined)
                    form.setValue('primaryPICId', response.data.data.primary_pic_id ?? undefined)
                    form.setValue('secondaryPICId', response.data.data.secondary_pic_id ?? undefined)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchDataIndicator()
    }, [id, form])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="flex flex-row gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tahun</FormLabel>
                                                <Select disabled onValueChange={field.onChange} value={field.value} defaultValue={indicator?.year}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <SelectItem key={i} value={String(thisYear - i)}>
                                                                {thisYear - i}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="kpiCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode Indikator Kinerja</FormLabel>
                                                <FormControl>
                                                    <Input disabled placeholder="0.0" {...field} defaultValue={indicator?.kpiCode} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-fit md:min-w-[400px] space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama Indikator Kinerja</FormLabel>
                                                <FormControl>
                                                    <Input disabled placeholder="nama" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="standard"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Standart Nilai</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="baseline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Baseline Indikator Kinerja</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="target"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Indikator Kinerja</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit">
                                    Simpan
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
