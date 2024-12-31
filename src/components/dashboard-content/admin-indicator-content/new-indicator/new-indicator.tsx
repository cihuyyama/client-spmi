"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ReactSelect, { GroupBase, OptionsOrGroups } from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bidang, CategoryUnit, Jadwal, SubUnit, Unit } from "@/lib/types";
type OptionType = {
    value: string;
    label: string;
};
export default function NewAdminIndicatorContent() {
    const [units, setUnit] = useState<Unit[]>([]);
    const [allUnits, setAllUnit] = useState<Unit[]>([]);
    const [bidang, setBidang] = useState<Bidang[]>();
    const [jadwal, setJadwal] = useState<Jadwal[]>();
    const [category, setCategory] = useState<CategoryUnit[]>([]);
    const router = useRouter();
    const thisYear = new Date().getFullYear() + 1
    const formSchema = z.object({
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
        baseline: z.string({
            required_error: "Baseline KPI harus diisi"
        }).optional(),
        target: z.string({
            required_error: "Target KPI harus diisi"
        }).optional(),
        secondaryPICId: z.string().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            sifat: "Wajib",
            year: undefined,
            bidangId: undefined,
            primaryPICId: "",
            secondaryPICId: "",
            standard: undefined,
            baseline: undefined,
            target: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/indicator`, {
                    ...values,
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/admin-indicator')
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
                    setAllUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataBidang = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/bidang`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setBidang(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataJadwal = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/jadwal`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setJadwal(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataUnitCategory = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/category-unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setCategory(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchDataUnit();
        fetchDataBidang();
        fetchDataJadwal();
        fetchDataUnitCategory();
    }, [])

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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            Array.from({ length: 5 }, (_, i) => (
                                                                <SelectItem key={i} value={`${thisYear - i}`}>{thisYear - i}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bidangId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bidang</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setUnit(allUnits.filter((unit) => unit.bidangId === value));
                                                        field.onChange(value);
                                                    }}
                                                    defaultValue={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Bidang" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {bidang && bidang.map((data: Bidang) => (
                                                            <SelectItem key={data.id} value={data.id}>{data.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="w-full md:min-w-[400px] space-y-4">
                                    <div className="flex flex-row w-full gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
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
                                            name="standard"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Standar Nilai</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" {...field} value={field.value} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>


                                    <div className="flex flex-row w-full gap-4">
                                        <FormField
                                            control={form.control}
                                            name="primaryPICId"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Penanggung Jawab</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {category.map((cat: any) => (
                                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondaryPICId"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Penanggung Jawab Tambahan</FormLabel>
                                                    <FormControl>
                                                        <ReactSelect<OptionType, false, GroupBase<OptionType>>
                                                            options={allUnits?.map((unit) => ({ value: unit.id, label: unit.name }))}
                                                            value={allUnits.find((unit) => unit.id === field.value)
                                                                ? { value: field.value || '', label: allUnits.find((unit) => unit.id === field.value)?.name || '' }
                                                                : null}
                                                            onChange={(option) => field.onChange(option?.value || '')}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <Button type="submit">Simpan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
