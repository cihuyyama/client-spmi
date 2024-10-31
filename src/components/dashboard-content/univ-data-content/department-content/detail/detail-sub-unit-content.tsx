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
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { SubUnit } from "@/lib/types";

export default function DetailSubUnitContent({ id }: { id: string }) {
    const [unit, setUnit] = useState([])
    const [subUnit, setSubUnit] = useState<SubUnit>()
    const formSchema = z.object({
        name: z.string({
            required_error: 'Nama unit kerja is required',
        }).min(1),
        unit_id: z.string({
            required_error: 'Unit is required',
        }).min(1),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            unit_id: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/sub-unit/${id}`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
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
                const response = await axios.get(`${BASE_URL}/unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setUnit(response.data.data)
                }
            } catch (error) {
                return error;
            }
        };
        const fetchDataSubUnit = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/sub-unit/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setSubUnit(response.data.data)
                    form.setValue('name', response.data.data.name ?? "");
                    form.setValue('unit_id', response.data.data.unit.id ?? "");
                }
            } catch (error) {
                return error;
            }
        };

        fetchData();
        fetchDataSubUnit();
    }, [id, form])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="max-w-[400px]">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sub Unit Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Sub Unit Name" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unit_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue={subUnit?.unit_id}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unit.map((unit: any) => (
                                                            <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
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
