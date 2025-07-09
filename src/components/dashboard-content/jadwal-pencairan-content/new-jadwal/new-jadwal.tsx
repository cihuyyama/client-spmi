"use client"
import { date, z } from "zod";
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
import { CalendarIcon, PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tahap } from "@/constant/tahap";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryUnit } from "@/lib/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
export default function NewJadwalPencairanContent() {
    const router = useRouter();
    const thisYear = new Date().getFullYear() + 1
    const [categories, setCategories] = useState<CategoryUnit[]>([]);
    const createPeriodeSPMU = z.object({
        periode: z.string({
            required_error: "Periode harus diisi"
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
    })
    const formSchema = z.object({
        unitId: z.array(z.string({
            required_error: "Unit ID harus diisi"
        })),
        tahun: z.string({
            required_error: "Tahun harus diisi"
        }),
        batasKegiatan: z.number({
            required_error: "Batas Kegiatan harus diisi"
        }),
        tunggakanSPJ: z.number().optional(),
        periodeSPMU: z.array(createPeriodeSPMU).min(1, {
            message: "Periode SPMU harus diisi"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unitId: [],
            tahun: '',
            batasKegiatan: undefined,
            tunggakanSPJ: 0,
            periodeSPMU: [{
                periode: '',
                dateRange: {
                    from: undefined,
                    to: undefined
                }
            }]
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
                axios.post(`${BASE_URL}/jadwal-pencairan`, {
                    ...values,
                }, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        // setTimeout(() => {
                        //     router.push('/')
                        // }, 300);
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
                                    {/* Tahun Field */}
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

                                    {/* Batas Kegiatan Field */}
                                    <FormField
                                        control={form.control}
                                        name="batasKegiatan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Batas Kegiatan</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Masukkan batas kegiatan"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col space-y-8 w-fit">
                                    {/* Periode SPMU Array Fields */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Periode SPMU</FormLabel>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const currentPeriodes = form.getValues('periodeSPMU');
                                                    form.setValue('periodeSPMU', [
                                                        ...currentPeriodes,
                                                        { periode: '', dateRange: { from: undefined, to: undefined } }
                                                    ]);
                                                }}
                                            >
                                                <PlusCircle className="w-4 h-4 mr-2" />
                                                Tambah Periode
                                            </Button>
                                        </div>

                                        {form.watch('periodeSPMU')?.map((_, index) => (
                                            <div key={index} className="flex gap-4 items-start">
                                                <FormField
                                                    control={form.control}
                                                    name={`periodeSPMU.${index}.periode`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Periode {index + 1}</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? (
                                                                                format(new Date(field.value), "PPP")
                                                                            ) : (
                                                                                <span>Pilih tanggal Periode SPMU</span>
                                                                            )}
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={new Date(field.value)}
                                                                        onSelect={(date) => {
                                                                            field.onChange(date ? date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : "")
                                                                        }}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`periodeSPMU.${index}.dateRange`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Rentang Tanggal</FormLabel>
                                                            <Popover modal={true}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "w-[300px] justify-start text-left font-normal",
                                                                            !field.value?.from && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {field.value?.from ? (
                                                                            field.value.to ? (
                                                                                <>
                                                                                    {format(field.value.from, "LLL y")} -{" "}
                                                                                    {format(field.value.to, "LLL y")}
                                                                                </>
                                                                            ) : (
                                                                                format(field.value.from, "LLL y")
                                                                            )
                                                                        ) : (
                                                                            <span>Pilih rentang tanggal</span>
                                                                        )}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        initialFocus
                                                                        mode="range"
                                                                        defaultMonth={field.value?.from}
                                                                        selected={{
                                                                            from: field.value?.from,
                                                                            to: field.value?.to,
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

                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="mt-8"
                                                        onClick={() => {
                                                            const currentPeriodes = form.getValues('periodeSPMU');
                                                            form.setValue(
                                                                'periodeSPMU',
                                                                currentPeriodes.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                                </div>
                                <Button type="submit">Simpan</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
