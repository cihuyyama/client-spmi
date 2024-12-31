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
import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";

export default function NewVisiMisiContent() {
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const router = useRouter();
    const thisYear = new Date().getFullYear() + 1
    const formSchema = z.object({
        subUnitId: z.string({
            required_error: "Sub Unit harus diisi",
        }).min(1).nullable().optional(),
        unitId: z.string({
            required_error: "Sub Unit harus diisi",
        }).min(1).nullable().optional(),
        tahun: z.string({
            required_error: "Tahun harus diisi",
        }).min(1),
        visi: z.string({
            required_error: "Visi harus diisi",
        }).min(1),
        misi: z.string({
            required_error: "Misi harus diisi",
        }).min(1),
        tujuan: z.string({
            required_error: "Tujuan harus diisi",
        }).min(1),
        keterangan: z.string({
            required_error: "Keterangan harus diisi",
        }).min(1),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subUnitId: "none",
            unitId: "none",
            tahun: thisYear.toString(),
            visi: "",
            misi: "",
            tujuan: "",
            keterangan: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (values.unitId === "none" && values.subUnitId === "none") {
                return toast.error("salah satu Unit atau Sub Unit harus diisi")
            }
            if (values.unitId === "none") {
                values.unitId = null
            }
            if (values.subUnitId === "none") {
                values.subUnitId = null
            }
            toast.promise(
                axios.post(`${BASE_URL}/visi-misi`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/visi-misi')
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
                                        name="unitId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={"none"} disabled={form.getValues('subUnitId') === "none" ? false : true} >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            None
                                                        </SelectItem>
                                                        {userInfo?.unit && userInfo.unit.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* <FormField
                                        control={form.control}
                                        name="subUnitId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sub Unit</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={"none"} disabled={form.getValues('unitId') === "none" ? false : true} >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sub Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            None
                                                        </SelectItem>
                                                        {userInfo?.sub_unit && userInfo?.sub_unit.map((subUnit) => (
                                                            <SelectItem key={subUnit.id} value={subUnit.id}>
                                                                {subUnit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}
                                    <FormField
                                        control={form.control}
                                        name="tahun"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tahun</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <SelectItem key={i} value={String(thisYear - i)}>
                                                                {thisYear - i}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-row w-full gap-4">
                                    <FormField
                                        control={form.control}
                                        name="visi"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Visi</FormLabel>
                                                <FormControl>
                                                    <Textarea className="min-h-[120px]" placeholder="Visi" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="misi"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Misi</FormLabel>
                                                <FormControl>
                                                    <Textarea className="min-h-[120px]" placeholder="Misi" {...field} value={field.value} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="tujuan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tujuan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[160px]"
                                                    placeholder="Tujuan" {...field} value={field.value} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="keterangan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keterangan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[160px]"
                                                    placeholder="Keterangan" {...field} value={field.value} />
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
