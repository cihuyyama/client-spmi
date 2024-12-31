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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ReactSelect, { GroupBase, OptionsOrGroups } from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tahap } from "@/constant/tahap";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryUnit } from "@/lib/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
export default function NewPaguContent() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryUnit[]>([]);
    const thisYear = new Date().getFullYear() + 1
    const formSchema = z.object({
        unitId: z.array(z.string({
            required_error: "Unit ID harus diisi"
        })),
        pagu: z.number({
            required_error: "Pagu harus diisi"
        }),
        tahun: z.string({
            required_error: "Tahun harus diisi"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unitId: [],
            pagu: undefined,
            tahun: undefined,
        },
    })

    const handleSelectAllUnits = () => {
        const allUnitIds = categories.flatMap(category =>
            category.Unit.map(unit => unit.id)
        )
        form.setValue('unitId', allUnitIds)
    }

    const handleSelectAllUnitsInCategory = (categoryId: string) => {
        const categoryUnitIds = categories
            .find(category => category.id === categoryId)?.Unit
            .map(unit => unit.id) || []

        const currentSelectedUnits = form.getValues('unitId')
        const updatedUnits = new Set([...currentSelectedUnits, ...categoryUnitIds])

        form.setValue('unitId', Array.from(updatedUnits))
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/pagu`, {
                    ...values,
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        // setTimeout(() => {
                        //     router.push('/indicator')
                        // }, 300);
                        return `Berhasil menyimpan data`
                    },
                    error: (e) => {
                        return `${e}`
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
                const response = await axios.get(`${BASE_URL}/category-unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setCategories(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        fetchDataUnit();
    }, []);

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
                                        name="tahun"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tahun</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="tahun" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            Array.from({ length: 5 }, (_, i) => (
                                                                <SelectItem key={i} value={`${thisYear - i}`}>{thisYear - i}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="pagu"
                                    render={({ field }) => (
                                        <FormItem className="w-fit min-w-[150px]">
                                            <FormLabel>Total Pagu Anggaran</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder=""
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = e.target.value === ''
                                                            ? undefined
                                                            : Number(e.target.value)
                                                        field.onChange(value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unitId"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Pilih Unit</FormLabel>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleSelectAllUnits}
                                                >
                                                    Pilih Semua Unit
                                                </Button>
                                            </div>

                                            {categories.map((category) => (
                                                <div key={category.id} className="mb-4 ml-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <FormLabel className="font-bold">{category.name}</FormLabel>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSelectAllUnitsInCategory(category.id)}
                                                        >
                                                            Pilih Semua Unit di Kategori
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col gap-2 my-4 ml-3">
                                                        {category?.Unit?.map((unit) => (
                                                            <FormField
                                                                key={unit.id}
                                                                control={form.control}
                                                                name="unitId"
                                                                render={({ field }) => (
                                                                    <FormItem
                                                                        key={unit.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0 "
                                                                    >
                                                                        <div className="w-full flex flex-wrap gap-1">
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={field.value?.includes(unit.id)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        return checked
                                                                                            ? field.onChange([...field.value, unit.id])
                                                                                            : field.onChange(
                                                                                                field.value?.filter(
                                                                                                    (value) => value !== unit.id
                                                                                                )
                                                                                            )
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="font-normal">
                                                                                {unit.name}
                                                                            </FormLabel>
                                                                        </div>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Simpan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
