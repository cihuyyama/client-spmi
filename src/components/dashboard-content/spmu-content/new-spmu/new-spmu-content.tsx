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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter as useBidang } from "next/navigation";
import { useEffect, useState } from "react";
import { Indicator, MatoIndicator, SPP } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewSPMUContent({ tahun, periode, unitId }: { tahun: string, periode: string, unitId: string }) {
    const [spp, setSpp] = useState<SPP[]>([]);
    const formSchema = z.object({
        tahun: z.string({
            required_error: "Tahun harus diisi"
        }),
        sppId: z.string({
            required_error: "SPP ID harus diisi"
        }),
        biroApproval: z.boolean().optional(),
        wr2Approval: z.boolean().optional(),
        tanggal: z.date().optional(),
        status: z.boolean().optional(),
        periodeSPMUId: z.string({
            required_error: "Periode SPMU harus diisi"
        }),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: tahun,
            sppId: "",
            periodeSPMUId: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/spmu`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            // bidang.push('/bidang')
                        }, 300);
                        return `Berhasil menyimpan data`
                    },
                    error: (e) => {
                        return `Gagal menyimpan data: Duplicate SPP`
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
                const response = await axios.get(`${BASE_URL}/spp/recomended?year=${tahun}&unitId=${unitId}&periodeId=${periode}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setSpp(response.data.data);
                    form.setValue("periodeSPMUId", periode);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [tahun, unitId, periode]);
    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="sppId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pilih Indikator</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih SPP" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {spp && spp.map((data: SPP) => (
                                                        <SelectItem key={data.id} value={data.id}>{data.noSpp}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
