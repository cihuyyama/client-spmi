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
import { JenisRekening, SubUnit, Unit } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewMataRekeningContent() {
    const [units, setUnit] = useState<Unit[]>();
    const [jenis, setJenis] = useState<JenisRekening[]>();
    const router = useRouter();
    const formSchema = z.object({
        noRek: z.string({
            required_error: "Kode Rekening harus diisi"
        }),
        name: z.string({
            required_error: "Nama Rekening harus diisi"
        }),
        jenisId: z.string({
            required_error: "Jenis MA harus diisi"
        }),
        units: z.array(z.string()).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            noRek: undefined,
            name: undefined,
            units: [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/rekening`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/mata-rekening')
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
                    setUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataJenisRekening = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/jenis-rekening`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setJenis(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchDataUnit();
        fetchDataJenisRekening();
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
                                        name="noRek"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode Mata Rekening</FormLabel>
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
                                                <FormLabel>Nama Mata Rekening</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="nama" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="jenisId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jenis Rekening</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Jenis" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {jenis && jenis.map((jenis: JenisRekening) => (
                                                            <SelectItem key={jenis.id} value={jenis.id}>{jenis.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="units"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pilih Unit Kerja</FormLabel>
                                                <FormControl>
                                                    <ReactSelect
                                                        isMulti
                                                        options={(units ?? []).map((unit) => ({
                                                            value: unit.id,
                                                            label: unit.name,
                                                        }))}
                                                        value={(form.getValues('units') || []).map((id) => {
                                                            const unit = units?.find((u) => u.id === id);
                                                            return unit ? { value: unit.id, label: unit.name } : null;
                                                        })}
                                                        onChange={(selectedOptions) => {
                                                            const selectedUnitIds = selectedOptions
                                                                .filter((option) => option !== null)
                                                                .map((option) => option!.value);
                                                            form.setValue('units', selectedUnitIds);
                                                        }}
                                                    />
                                                </FormControl>
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
