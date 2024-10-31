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
import ReactSelect from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Indicator, MataAnggaran, Rekening, SubUnit, Unit } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar";

export default function NewPembelianContent({ id, prokerId }: { id: string, prokerId: string }) {
    const [rek, setRek] = useState<Rekening[]>([])
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
        satuan: z.string({
            required_error: "Satuan harus diisi"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rekeningId: undefined,
            prokerId: prokerId,
            uraian: undefined,
            satuan: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/pembelian`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            window.location.reload()
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
                const response = await axios.get(`${BASE_URL}/rekening/by-user`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setRek(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchDataMA();
    }, [form, id])

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
                                            <FormItem className="w-fit">
                                                <FormLabel>Mata Rekening</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="rekening" />
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
                                        <FormItem className=" md:min-w-[500px] w-fit">
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
                                <FormField
                                    control={form.control}
                                    name="satuan"
                                    render={({ field }) => (
                                        <FormItem className=" md:min-w-[500px] w-fit">
                                            <FormLabel>Satuan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="satuan"
                                                    {...field}
                                                    value={field.value}
                                                />
                                            </FormControl>
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
