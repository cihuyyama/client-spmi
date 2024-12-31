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
import { Indicator, MataAnggaran, SubUnit, Unit } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function NewMAtoIndicatorContent({ id }: { id: string }) {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const unit = userInfo?.unitData.length === 1 ? userInfo.unitData[0].id : undefined;
    const [indicator, setIndicator] = useState<Indicator>();
    const thisDate = new Date();
    const nextYear = new Date(thisDate.getFullYear() + 1, thisDate.getMonth(), thisDate.getDate());
    const router = useRouter();
    const formSchema = z.object({
        kpiId: z.string({
            required_error: "KPI ID harus diisi"
        }),
        maId: z.string({
            required_error: "MA ID harus diisi"
        }),
        uraian: z.string({
            required_error: "Uraian harus diisi"
        }),
        output: z.string({
            required_error: "Output harus diisi"
        }),
        dateRange: z.object(
            {
                from: z.date().optional(),
                to: z.date().optional(),
            },
            {
                required_error: "Please select a date range",
            }
        ),
    }).refine((data) => data.dateRange.from && data.dateRange.to && data.dateRange.from < data.dateRange.to, {
        path: ["dateRange"],
        message: "From date must be before to date",
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kpiId: id ?? "",
            maId: "",
            uraian: "",
            output: "",
            dateRange: {
                from: undefined,
                to: undefined,
            },
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/ma-to-indicator/`, {
                    ...values,
                    unitId: unit
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push(`/indicator/${id}/ma-to-indicator`)
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
                const response = await axios.get(`${BASE_URL}/indicator/${id}`, {
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

        form.setValue("kpiId", id)
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
                                        name="maId"
                                        render={({ field }) => (
                                            <FormItem className="w-fit">
                                                <FormLabel>Mata Anggaran</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Mata Anggaran" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {indicator?.ma.map((ma) => (
                                                            <SelectItem key={ma.id} value={ma.id}>
                                                                {ma.maCode} - {ma.name}
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
                                        name="dateRange"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col space-y-3 mt-[6px]">
                                                <FormLabel>Waktu</FormLabel>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date"
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value.from && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value.from ? (
                                                                field.value.to ? (
                                                                    <>
                                                                        {format(field.value.from, "LLL y")} -{" "}
                                                                        {format(field.value.to, "LLL y")}
                                                                    </>
                                                                ) : (
                                                                    format(field.value.from, "LLL y")
                                                                )
                                                            ) : (
                                                                <span>Jangka Waktu</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="center">
                                                        <Calendar
                                                            initialFocus
                                                            mode="range"
                                                            defaultMonth={field.value.from}
                                                            selected={{
                                                                from: field.value.from!,
                                                                to: field.value.to,
                                                            }}
                                                            onSelect={field.onChange}
                                                            numberOfMonths={2}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
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
                                    name="output"
                                    render={({ field }) => (
                                        <FormItem className=" md:min-w-[500px] w-fit">
                                            <FormLabel>Output</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[80px]"
                                                    placeholder="output"
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
