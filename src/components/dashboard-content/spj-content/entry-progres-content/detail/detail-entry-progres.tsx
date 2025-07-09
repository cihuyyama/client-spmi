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
import { DialogUploader } from "./dialog-uploader";
import { TahapDokumen } from "./upload-file";
import { DataTable } from "./data-table";
import { dokumenColumn } from "./columns";

export default function DetailEntryProgresContent({ prokerId }: { prokerId: string }) {
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

        fetchData();
    }, [prokerId, form]);


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
                                            Kegiatan
                                        </span>
                                        <span className="font-semibold">
                                            Indikator
                                        </span>
                                        <span className="font-semibold">
                                            Pencairan
                                        </span>
                                        <span className="font-semibold">
                                            Output
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span>
                                            : {data && data.MA.maCode} - {data && data.uraian}
                                        </span>
                                        <span>
                                            : {data && data.KPI.kpiCode} - {data && data.KPI.name}
                                        </span>
                                        <span>
                                            : {data && data.anggaranDiminta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} / {data && data.anggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} = {data && (data.anggaranDiminta / data.anggaran) * 100} %
                                        </span>
                                        <span>
                                            : {data && data.output}
                                        </span>
                                    </div>
                                </div>
                            </div>

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
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value ?? ""}>
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
                                                                <Input placeholder="Masukkan Realisasi Output" {...field}
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
                                                            <Select onValueChange={field.onChange} defaultValue={field.value ?? ""} value={field.value ?? ""}>
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
                                                                <Input placeholder="Masukkan Realisasi Output" {...field} value={field.value ?? ""} />
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
                                                            <Select onValueChange={field.onChange} defaultValue={field.value ?? ""} value={field.value ?? ""}>
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
                                        <Button type="submit" className="w-fit mt-4">Simpan</Button>

                                    </div>
                                </form>
                            </Form>

                            <div className=" w-full flex flex-col mt-4 justify-start min-h-[400px]">
                                <span className="font-semibold text-lg text-center bg-blue-100 rounded-md">
                                    File Pendukung
                                </span>
                                <Tabs defaultValue="persiapan" className="w-full mt-2">
                                    <TabsList>
                                        <TabsTrigger value="persiapan">Dokumen Persiapan</TabsTrigger>
                                        <TabsTrigger value="pelaksanaan">Dokumen Pelaksanaan</TabsTrigger>
                                        <TabsTrigger value="laporan">Dokumen Laporan Akhir</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="persiapan">
                                        <div >
                                            <div className="flex flex-col w-full min-h-[200px]">
                                                <DataTable
                                                    columns={dokumenColumn}
                                                    data={data?.dokumenPersiapan ?? []}
                                                />
                                            </div>
                                            <DialogUploader id={prokerId} tahap={TahapDokumen.Persiapan} />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="pelaksanaan">
                                        <div >
                                            <div className="flex flex-col w-full min-h-[200px]">
                                                <DataTable
                                                    columns={dokumenColumn}
                                                    data={data?.dokumenPelaksanaan ?? []}
                                                />
                                            </div>
                                            <DialogUploader id={prokerId} tahap={TahapDokumen.Pelaksanaan} />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="laporan">
                                        <div >
                                            <div className="flex flex-col w-full min-h-[200px]">
                                                <DataTable
                                                    columns={dokumenColumn}
                                                    data={data?.dokumenLaporan ?? []}
                                                />
                                            </div>
                                            <DialogUploader id={prokerId} tahap={TahapDokumen.Laporan} />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                            </div>

                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
