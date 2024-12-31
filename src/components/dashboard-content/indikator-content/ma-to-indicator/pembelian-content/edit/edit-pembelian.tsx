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
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pembelian, Rekening } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EditPembelianContent({ id, prokerId, belanjaId }: { id: string, prokerId: string, belanjaId: string }) {
    const [rek, setRek] = useState<Rekening[]>([])
    const [belanja, setBelanja] = useState<Pembelian>()
    const router = useRouter();
    const formSchema = z.object({
        rekeningId: z.string({
            required_error: "Rekening ID harus diisi"
        }),
        prokerId: z.string({
            required_error: "MA ID harus diisi"
        }),
        uraian: z.string({
            required_error: "Uraian harus diisi"
        }),
        satuan: z.array(z.string(), {
            required_error: "Satuan harus diisi"
        }),
        jumlah: z.number({
            required_error: "Jumlah harus diisi"
        }),
        nilaiSatuan: z.number({
            required_error: "Nilai Satuan harus diisi"
        }),
        kuantitas: z.array(z.string(), {
            required_error: "Kuantitas harus diisi"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rekeningId: '',
            prokerId: prokerId,
            uraian: '',
            satuan: [],
            jumlah: 0,
            nilaiSatuan: 0,
            kuantitas: []
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/pembelian/${belanjaId}`, {
                    ...values,
                    satuan: values.satuan.join("."),
                    kuantitas: values.kuantitas.join("."),
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push(`/indicator/${id}/ma-to-indicator/${prokerId}/belanja`)
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
        const fetchDataMA = async () => {
            try {
                const [rekRes, belanjaRes] = await Promise.all([
                    axios.get(`${BASE_URL}/rekening`, {
                        withCredentials: true
                    }),
                    axios.get(`${BASE_URL}/pembelian/${belanjaId}`, {
                        withCredentials: true
                    })
                ])
                if (rekRes.status === 200) {
                    setRek(rekRes.data.data)
                }
                if (belanjaRes.status === 200) {
                    setBelanja(belanjaRes.data.data)
                    form.setValue("rekeningId", belanjaRes.data.data.rekeningId)
                    form.setValue("uraian", belanjaRes.data.data.uraian)
                    form.setValue("satuan", belanjaRes.data.data.satuan.split("."))
                    form.setValue("jumlah", belanjaRes.data.data.jumlah)
                    form.setValue("nilaiSatuan", belanjaRes.data.data.nilaiSatuan)
                    form.setValue("kuantitas", belanjaRes.data.data.kuantitas.split("."))
                }
            } catch (error) {
                return error;
            }
        };

        fetchDataMA();
    }, [form, id, belanjaId])

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "nilaiSatuan" || name === "kuantitas") {
                const nilaiSatuan = value.nilaiSatuan
                const kuantitas = value.kuantitas

                if (nilaiSatuan && kuantitas) {
                    const totalKuantitas = kuantitas.reduce((acc, curr) => acc + Number(curr), 0)
                    const jumlah = nilaiSatuan * totalKuantitas
                    form.setValue("jumlah", jumlah)
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="flex flex-row gap-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="rekeningId"
                                        render={({ field }) => (
                                            <FormItem className="w-fit md:min-w-[300px]">
                                                <FormLabel>Mata Rekening</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue={belanja?.rekening_id ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="pilih rekening" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {rek?.map((data) => (
                                                            <SelectItem key={data.id} value={data.id}>
                                                                {data.noRek} - {data.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="uraian"
                                    render={({ field }) => (
                                        <FormItem className=" md:min-w-[500px] w-full">
                                            <FormLabel>Uraian</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[80px]"
                                                    placeholder="uraian"
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-row w-full gap-6">
                                    <FormField
                                        control={form.control}
                                        name="satuan"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Satuan</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            placeholder="Input text"
                                                            {...field}
                                                            value={field.value?.[0] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[0] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <span className="text-black">•</span>
                                                        <Input
                                                            placeholder="Input text"
                                                            value={field.value?.[1] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[1] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <span className="text-black">•</span>
                                                        <Input
                                                            placeholder="Input text"
                                                            value={field.value?.[2] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[2] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nilaiSatuan"
                                        render={({ field: { onChange, value, ...fieldProps } }) => (
                                            <FormItem className="md:min-w-[500px] w-full">
                                                <FormLabel>Nilai Satuan (Rupiah)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...fieldProps}
                                                        placeholder="nilai satuan"
                                                        type="text"
                                                        onChange={(e) => {
                                                            const cleanValue = e.target.value.replace(/\D/g, '');
                                                            const numericValue = cleanValue ? Number(cleanValue) : '';
                                                            onChange(numericValue);
                                                        }}
                                                        value={
                                                            value
                                                                ? Number(value).toLocaleString('id-ID', {
                                                                    maximumFractionDigits: 0,
                                                                    useGrouping: true
                                                                }).replace(/,/g, '.')
                                                                : ''
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-row w-full gap-6">

                                    <FormField
                                        control={form.control}
                                        name="kuantitas"
                                        render={({ field }) => (
                                            <FormItem className="md:min-w-[500px] w-full">
                                                <FormLabel>Kuantitas</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            placeholder="Input number"
                                                            {...field}
                                                            value={field.value?.[0] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[0] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <span className="text-black">•</span>
                                                        <Input
                                                            placeholder="Input number"
                                                            value={field.value?.[1] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[1] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <span className="text-black">•</span>
                                                        <Input
                                                            placeholder="Input number"
                                                            value={field.value?.[2] || ""}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[2] = e.target.value;
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="jumlah"
                                        render={({ field: { onChange, value, ...fieldProps } }) => (
                                            <FormItem className="md:min-w-[500px] w-full">
                                                <FormLabel>Jumlah (Rupiah)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...fieldProps}
                                                        placeholder="jumlah"
                                                        type="text"
                                                        onChange={(e) => {
                                                            const cleanValue = e.target.value.replace(/\D/g, '');
                                                            const numericValue = cleanValue ? Number(cleanValue) : '';
                                                            onChange(numericValue);
                                                        }}
                                                        disabled
                                                        value={
                                                            value
                                                                ? Number(value).toLocaleString('id-ID', {
                                                                    maximumFractionDigits: 0,
                                                                    useGrouping: true
                                                                }).replace(/,/g, '.')
                                                                : ''
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
