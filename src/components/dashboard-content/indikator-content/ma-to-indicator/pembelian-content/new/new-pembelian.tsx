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
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaguAnggaran, Rekening } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewPembelianContent({ id, prokerId }: { id: string, prokerId: string }) {
    const [rek, setRek] = useState<Rekening[]>([])
    const [pagu, setPagu] = useState<PaguAnggaran>()
    const [anggaranTerpakai, setAnggaranTerpakai] = useState<number>(0)
    const [sisaAnggaran, setSisaAnggaran] = useState<number>(0)
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
            rekeningId: undefined,
            prokerId: prokerId,
            uraian: undefined,
            satuan: undefined,
            jumlah: undefined,
            nilaiSatuan: undefined,
            kuantitas: undefined
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/pembelian`, {
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
                const [rekRes, paguRes] = await Promise.all([
                    axios.get(`${BASE_URL}/rekening`, {
                        withCredentials: true
                    }),
                    axios.get(`${BASE_URL}/ma-to-indicator/${prokerId}/proker`, {
                        withCredentials: true
                    })
                ])
                if (rekRes.status === 200) {
                    setRek(rekRes.data.data)
                }
                if (paguRes.status === 200) {
                    setPagu(paguRes.data.meta.pagu);
                    const anggaranTerpakai = paguRes.data.meta.pagu?.Pembelian?.reduce((acc: number, curr: { jumlah: string }) => acc + Number(curr.jumlah), 0) ?? 0
                    setAnggaranTerpakai(anggaranTerpakai)
                    setSisaAnggaran(Number(paguRes.data.meta.pagu?.pagu ?? 0) - (anggaranTerpakai ?? 0))
                }
            } catch (error) {
                return error;
            }
        };

        fetchDataMA();
    }, [form, id, prokerId]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "nilaiSatuan" || name === "kuantitas") {
                const nilaiSatuan = value.nilaiSatuan
                const kuantitas = value.kuantitas

                if (nilaiSatuan && kuantitas) {
                    const totalKuantitas = kuantitas.reduce((acc, curr) => acc * Number(curr ?? "1"), 1)
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        disabled
                                                        defaultValue={0}
                                                        placeholder="jumlah"
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
                                                <FormDescription>
                                                    <div className="pl-2 font-medium text-green-600">
                                                        Anggaran tersedia: Rp {sisaAnggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                    </div>
                                                    {sisaAnggaran - Number(value) < 0 && Number(value) != 0 ? (
                                                        <div className="text-destructive pl-2 font-medium">
                                                            Anggaran tidak mencukupi: {`Rp ${(sisaAnggaran - Number(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                                                        </div>
                                                    ) : (
                                                        <div className="pl-2 font-medium text-green-600">
                                                            Anggaran tersisa: {`Rp ${(sisaAnggaran - Number((value ?? 0))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                                                        </div>
                                                    )}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={sisaAnggaran - form.watch("jumlah", 0) < 0}
                                >
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
