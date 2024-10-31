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
import ReactSelect from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Indicator, JenisRekening, SubUnit, Unit } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewMataAnggaranContent() {
    const [data, setIndicator] = useState<Indicator[]>();
    const router = useRouter();
    const formSchema = z.object({
        maCode: z.string({
            required_error: "Kode MA harus diisi"
        }),
        name: z.string({
            required_error: "Nama MA harus diisi"
        }),
        indicatorId: z.string({
            required_error: "Nama indikator harus diisi"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maCode: undefined,
            name: undefined,
            indicatorId: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/mata-anggaran`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/mata-anggaran')
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

                const response = await axios.get(`${BASE_URL}/indicator`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setIndicator(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchData();
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
                                        name="maCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode Mata Anggaran</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0.0" {...field} value={field.value} />
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
                                                <FormLabel>Nama Mata Anggaran</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="nama" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="indicatorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pilih Indikator</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih indikator" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {data && data.map((data: JenisRekening) => (
                                                            <SelectItem key={data.id} value={data.id}>{data.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
