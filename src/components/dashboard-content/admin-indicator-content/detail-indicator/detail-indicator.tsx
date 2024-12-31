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

export default function DetailAdminIndicatorContent({ id }: { id: string }) {
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const [indicator, setIndicator] = useState<Indicator>();
    const [units, setUnit] = useState<Unit[]>([]);
    const [subUnits, setSubUnit] = useState<SubUnit[]>([]);
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
        baseline: z.string({
            required_error: "Baseline KPI harus diisi"
        }),
        target: z.string({
            required_error: "Target KPI harus diisi"
        }),
        year: z.string({
            required_error: "Tahun KPI harus diisi"
        }),
        units: z.array(z.string()).optional(),
        subUnits: z.array(z.string()).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kpiCode: indicator?.kpiCode ?? "",
            name: indicator?.name ?? "",
            sifat: indicator?.sifat ?? "",
            baseline: indicator?.baseline ?? "",
            target: indicator?.target ?? "",
            year: indicator?.year ?? thisYear.toString(),
            units: [],
            subUnits: [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
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
        const fetchDataUnit = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataSubUnit = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/sub-unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setSubUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataIndicator = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/indicator/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setIndicator(response.data.data)
                    form.setValue('kpiCode', response.data.data.kpiCode)
                    form.setValue('name', response.data.data.name)
                    form.setValue('sifat', response.data.data.sifat)
                    form.setValue('baseline', response.data.data.baseline)
                    form.setValue('target', response.data.data.target)
                    form.setValue('year', response.data.data.year)
                    form.setValue('units', response.data.data.units.map((unit: Unit) => unit.id))
                    form.setValue('subUnits', response.data.data.sub_units.map((subUnit: SubUnit) => subUnit.id))
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchDataUnit();
        fetchDataSubUnit();
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
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue={indicator?.year}>
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
                                                    <Input placeholder="0.0" {...field} defaultValue={indicator?.kpiCode} value={field.value} />
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
                                                    <Input placeholder="nama" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sifat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sifat Indikator Kinerja</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Utama/Tambahan" {...field} value={field.value} />
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
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
