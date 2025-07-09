"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL, BASE_URL_FILE } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MatoIndicator } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "./data-table";
import { belanjaColumn } from "./columns";
import { Separator } from "@/components/ui/separator";

export default function DetailEntrySPJContent({ prokerId }: { prokerId: string }) {
    const [data, setData] = useState<MatoIndicator>();
    const router = useRouter();
    const formSchema = z.object({
        prokerId: z.string({
            required_error: "Proker ID tidak ditemukan"
        }),

        statusKegiatan: z.string().optional().nullable(),
        persenKegiatan: z.number().optional().nullable(),
        uraianKegiatan: z.string().optional().nullable(),
        realisasiOutputKegiatan: z.string().optional().nullable(),
        statusDiperbaiki: z.boolean().optional().nullable(),

        statusPenilaianBPM: z.string().optional().nullable(),
        persenPenilaianBPM: z.number().optional().nullable(),
        uraianPenilaianBPM: z.string().optional().nullable(),
        realisasiOutputBPM: z.string().optional().nullable(),
        statusApprovalBPM: z.string().optional().nullable(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prokerId: prokerId,
            statusKegiatan: "",
            persenKegiatan: undefined,
            uraianKegiatan: "",
            realisasiOutputKegiatan: "",
            statusDiperbaiki: undefined,

            statusPenilaianBPM: "",
            persenPenilaianBPM: undefined,
            uraianPenilaianBPM: "",
            realisasiOutputBPM: "",
            statusApprovalBPM: "",
        },
    })

    const spjSchema = z.object({
        prokerId: z.string({
            required_error: "Proker ID tidak ditemukan"
        }),

        noSPJ: z.string().optional(),
        nominalSPJ: z.number().optional(),

        statusPersetujuanBiro: z.string().optional(),
        keteranganBiro: z.string().optional(),
        tanggalApprovalBiro: z.string().optional(),

        statusPersetujuanBPM: z.string().optional(),
        keteranganBPM: z.string().optional(),
        tanggalApprovalBPM: z.string().optional(),
    })

    const spjForm = useForm<z.infer<typeof spjSchema>>({
        resolver: zodResolver(spjSchema),
        defaultValues: {
            prokerId: prokerId,
            noSPJ: "",
            nominalSPJ: undefined,

            statusPersetujuanBiro: "",
            keteranganBiro: "",
            tanggalApprovalBiro: "",

            statusPersetujuanBPM: "",
            keteranganBPM: "",
            tanggalApprovalBPM: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/entry-progres?id=${prokerId}`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            // router.push('/jenis-rekening')
                            // window.location.reload();
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

    function onSubmitSPJ(values: z.infer<typeof spjSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/entry-spj`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            // router.push('/jenis-rekening')
                            // window.location.reload();
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
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/entry-progres?prokerId=${prokerId}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setData(response.data.data);
                    form.setValue("statusKegiatan", response.data.data.ProgresSPJ?.statusKegiatan);
                    form.setValue("persenKegiatan", response.data.data.ProgresSPJ?.persenKegiatan);
                    form.setValue("uraianKegiatan", response.data.data.ProgresSPJ?.uraianKegiatan);
                    form.setValue("realisasiOutputKegiatan", response.data.data.ProgresSPJ?.realisasiOutputKegiatan);
                    form.setValue("statusDiperbaiki", response.data.data.ProgresSPJ?.statusDiperbaiki);

                    form.setValue("statusPenilaianBPM", response.data.data.ProgresSPJ?.statusPenilaianBPM);
                    form.setValue("persenPenilaianBPM", response.data.data.ProgresSPJ?.persenPenilaianBPM);
                    form.setValue("uraianPenilaianBPM", response.data.data.ProgresSPJ?.uraianPenilaianBPM);
                    form.setValue("realisasiOutputBPM", response.data.data.ProgresSPJ?.realisasiOutputBPM);
                    form.setValue("statusApprovalBPM", response.data.data.ProgresSPJ?.statusApprovalBPM);
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        const fetchSPJ = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/entry-progres?prokerId=${prokerId}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    spjForm.setValue("noSPJ", response.data.data.SPJ?.noSPJ);
                    spjForm.setValue("nominalSPJ", response.data.data.SPJ?.nominalSPJ);
                    spjForm.setValue("statusPersetujuanBiro", response.data.data.SPJ?.statusPersetujuanBiro);
                    spjForm.setValue("keteranganBiro", response.data.data.SPJ?.keteranganBiro);
                    spjForm.setValue("tanggalApprovalBiro", response.data.data.SPJ?.tanggalApprovalBiro);

                    spjForm.setValue("statusPersetujuanBPM", response.data.data.SPJ?.statusPersetujuanBPM);
                    spjForm.setValue("keteranganBPM", response.data.data.SPJ?.keteranganBPM);
                    spjForm.setValue("tanggalApprovalBPM", response.data.data.SPJ?.tanggalApprovalBPM);
                }
                return response.data;
            } catch (error) {
                return error;
            }
        }

        fetchData();
        fetchSPJ();
    }, [prokerId, form, spjForm]);


    // useEffect(() => {
    //     if (!data) return;

    //     form.setValue("statusKegiatan", data.ProgresSpj?.statusKegiatan);
    //     form.setValue("persenKegiatan", data.ProgresSpj?.persenKegiatan);
    //     form.setValue("uraianKegiatan", data.ProgresSpj?.uraianKegiatan);
    //     form.setValue("realisasiOutputKegiatan", data.ProgresSpj?.realisasiOutputKegiatan);
    //     form.setValue("statusDiperbaiki", data.ProgresSpj?.statusDiperbaiki);

    //     form.setValue("statusPenilaianBPM", data.ProgresSpj?.statusPenilaianBPM);
    //     form.setValue("persenPenilaianBPM", data.ProgresSpj?.persenPenilaianBPM);
    //     form.setValue("uraianPenilaianBPM", data.ProgresSpj?.uraianPenilaianBPM);
    //     form.setValue("realisasiOutputBPM", data.ProgresSpj?.realisasiOutputBPM);
    //     form.setValue("statusApprovalBPM", data.ProgresSpj?.statusApprovalBPM);

    // }, [data])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <div className="w-full">

                            <div className="flex flex-row gap-4 text-sm my-4 border-b pb-[35px]" >
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            No. SPMU
                                        </span>
                                        <span className="font-semibold">
                                            Tgl SPMU
                                        </span>
                                        <span className="font-semibold">
                                            Nominal
                                        </span>
                                        <span className="font-semibold">
                                            Kegiatan
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span>
                                            : {data && data.SPP?.SPMU.noSpmu}
                                        </span>
                                        <span>
                                            : {data && data.SPP?.SPMU.tanggal ? new Date(data.SPP.SPMU.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : ''}
                                        </span>
                                        <span>
                                            : {data && data.anggaranDiminta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </span>
                                        <span>
                                            : {data && data.uraian}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-4 text-sm my-4 border-b pb-[35px]" >
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold">
                                            No. SPJ
                                        </span>
                                        <span className="font-semibold">
                                            Tgl SPJ
                                        </span>
                                        <span className="font-semibold">
                                            Nominal SPJ
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span>
                                            : {data && data.SPJ?.noSPJ}
                                        </span>
                                        <span>
                                            : {data && data.SPJ?.createdAt ? new Date(data.SPJ.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : ''}
                                        </span>
                                        <span>
                                            : {data && data.SPJ?.nominalSPJ?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-0 text-sm">
                                <h1 className="mt-4 font-bold text-lg">
                                    Rincian SPJ per Mata Rekening
                                </h1>
                                <DataTable
                                    columns={belanjaColumn}
                                    data={data?.Pembelian ?? []}
                                    prokerId={prokerId}
                                />
                            </div>

                            <Separator orientation="horizontal" className="my-12" />


                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="border-b pb-[35px]">
                                        <div className="w-full flex flex-row gap-1 border shadow-md rounded-md bg-slate-50">

                                            <div className="w-1/2 p-4  space-y-4 border-r">
                                                <span className="font-semibold text-lg block mb-4">
                                                    PROGRES KEGIATAN
                                                </span>


                                                <FormField
                                                    control={form.control}
                                                    name="statusKegiatan"
                                                    render={({ field }) => (
                                                        <FormItem className="w-fit">
                                                            <FormLabel>Status Kegiatan</FormLabel>
                                                            <Select disabled onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih Status Kegiatan" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="belum_dimulai">Belum Dimulai</SelectItem>
                                                                    <SelectItem value="sedang_berjalan">Sedang Berjalan</SelectItem>
                                                                    <SelectItem value="selesai">Selesai</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="persenKegiatan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Persentase Kegiatan </FormLabel>
                                                            <FormControl>
                                                                <div className=" w-fit flex flex-row items-center gap-2 mr-2">
                                                                    <Input
                                                                        type="number"
                                                                        disabled
                                                                        placeholder="Masukkan Persentase"
                                                                        defaultValue={data?.ProgresSpj?.persenKegiatan}
                                                                        {...field}
                                                                        value={field.value ?? ""}
                                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    />
                                                                    <span className="w-full text-sm">% (angka bulat)</span>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="uraianKegiatan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Uraian Kegiatan</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Masukkan Uraian Kegiatan"
                                                                    disabled
                                                                    defaultValue={data?.ProgresSpj?.uraianKegiatan}
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="realisasiOutputKegiatan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Realisasi Output Kegiatan</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Masukkan Realisasi Output"
                                                                    disabled
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="statusDiperbaiki"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-fit">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value ?? false}
                                                                    onCheckedChange={field.onChange}
                                                                    disabled
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>
                                                                    Status Diperbaiki
                                                                </FormLabel>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>

                                            <div className="w-1/2 p-4 space-y-4 ">
                                                <span className="font-semibold text-lg block mb-4">
                                                    PROGRES PENILAIAN BPM
                                                </span>

                                                <FormField
                                                    control={form.control}
                                                    name="statusPenilaianBPM"
                                                    render={({ field }) => (
                                                        <FormItem className="w-fit">
                                                            <FormLabel>Status Penilaian BPM</FormLabel>
                                                            <Select disabled onValueChange={field.onChange} defaultValue={field.value ?? ""} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih Status Penilaian" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="belum_dinilai">Belum Dinilai</SelectItem>
                                                                    <SelectItem value="sedang_dinilai">Sedang Dinilai</SelectItem>
                                                                    <SelectItem value="selesai_dinilai">Selesai Dinilai</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="persenPenilaianBPM"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Persentase Penilaian BPM</FormLabel>
                                                            <FormControl>
                                                                <div className=" w-fit flex flex-row items-center gap-2 mr-2">
                                                                    <Input
                                                                        type="number"
                                                                        disabled
                                                                        placeholder="Masukkan Persentase"
                                                                        {...field}
                                                                        value={field.value ?? ""}
                                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    />
                                                                    <span className="w-full text-sm">% (angka bulat)</span>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="uraianPenilaianBPM"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Uraian Penilaian BPM</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Masukkan Uraian Penilaian"
                                                                    disabled
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="realisasiOutputBPM"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Realisasi Output BPM</FormLabel>
                                                            <FormControl>
                                                                <Input disabled placeholder="Masukkan Realisasi Output" {...field} value={field.value ?? ""} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="statusApprovalBPM"
                                                    render={({ field }) => (
                                                        <FormItem className="w-fit">
                                                            <FormLabel>Status Approval BPM</FormLabel>
                                                            <Select disabled onValueChange={field.onChange} defaultValue={field.value ?? ""} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih Status Approval" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                    <SelectItem value="disetujui">Disetujui</SelectItem>
                                                                    <SelectItem value="ditolak">Ditolak</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                        </div>
                                        {/* <Button type="submit" className="w-fit mt-4">Simpan</Button> */}

                                    </div>
                                </form>
                            </Form>


                            <Form {...spjForm}>
                                <form onSubmit={spjForm.handleSubmit(onSubmitSPJ)} className="space-y-4">
                                    <div className="border-b pb-[35px] mt-8">
                                        <div className="w-full flex flex-row gap-1 border shadow-md rounded-md bg-slate-50">

                                            <div className="w-1/2 p-4  space-y-4 border-r">
                                                <span className="font-semibold text-lg block mb-4">
                                                    STATUS SPJ
                                                </span>

                                                <span className="text-sm block mb-4 text-red-500">
                                                    Biro Keuangan
                                                </span>


                                                <FormField
                                                    control={spjForm.control}
                                                    name="statusPersetujuanBiro"
                                                    render={({ field }) => (
                                                        <FormItem className="w-fit">
                                                            <FormLabel>Status Persetujuan</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih Status Persetujuan" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="belum_dimulai">Belum Diproses</SelectItem>
                                                                    <SelectItem value="sedang_berjalan">Diterima</SelectItem>
                                                                    <SelectItem value="selesai">Ditolak</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={spjForm.control}
                                                    name="keteranganBiro"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Keterangan</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Masukkan Keterangan"
                                                                    defaultValue={data?.SPJ?.keteranganBiro}
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={spjForm.control}
                                                    name="tanggalApprovalBiro"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tanggal Approval/Update</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder=""
                                                                    disabled
                                                                    defaultValue={data?.SPJ?.tanggalApprovalBiro}
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>

                                            <div className="w-1/2 p-4 space-y-4 ">
                                                <span className="text-sm block mb-4 mt-10 text-red-500">
                                                    Biro Keuangan
                                                </span>

                                                <FormField
                                                    control={spjForm.control}
                                                    name="statusPersetujuanBPM"
                                                    render={({ field }) => (
                                                        <FormItem className="w-fit">
                                                            <FormLabel>Status Persetujuan BPM</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value ?? ""} value={field.value ?? ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Pilih Status Penilaian" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="belum_dinilai">Belum Diproses</SelectItem>
                                                                    <SelectItem value="sedang_dinilai">Diterima</SelectItem>
                                                                    <SelectItem value="selesai_dinilai">Ditolak</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={spjForm.control}
                                                    name="keteranganBPM"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Keterangan</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Masukkan Keterangan"
                                                                    defaultValue={data?.SPJ?.keteranganBPM}
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={spjForm.control}
                                                    name="tanggalApprovalBPM"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tanggal Approval/Update</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder=""
                                                                    disabled
                                                                    defaultValue={data?.SPJ?.tanggalApprovalBPM}
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>
                                        </div>
                                        <Button type="submit" className="w-fit mt-4">Simpan</Button>

                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
