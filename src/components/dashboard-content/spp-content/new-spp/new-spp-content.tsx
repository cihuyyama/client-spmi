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
import { Indicator, MatoIndicator } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewSPPContent({ tahun, periode, unitId }: { tahun: string, periode: string, unitId: string }) {
    const [selectedProkers, setSelectedProkers] = useState<string[]>([]);
    const [kpi, setKpi] = useState<Indicator[]>([]);
    const [selectedKpi, setSelectedKpi] = useState<Indicator>();
    const [prokerData, setProkerData] = useState<MatoIndicator[]>([]);
    const [selectedProker, setSelectedProker] = useState<MatoIndicator[]>();
    const createProkerSPPSchema = z.object({
        prokerId: z.string({
            required_error: "Proker ID harus diisi"
        }),
        diminta: z.number({
            required_error: "Anggaran yang Diminta harus diisi"
        }),
    })
    const formSchema = z.object({
        tahun: z.string({
            required_error: "Tahun harus diisi"
        }),
        otorisasi: z.boolean().optional(),
        status: z.boolean().optional(),
        periodeSPMUId: z.string({
            required_error: "Periode SPMU harus diisi"
        }),
        proker: z.array(createProkerSPPSchema).min(1, {
            message: "Proker harus diisi"
        }),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: tahun,
            periodeSPMUId: "",
            proker: []
        },
    })

    const watchedProkers = form.watch("proker");

    const handleProkerSelect = (prokerId: string, checked: boolean) => {
        // Update the selected prokers list
        if (checked) {
            setSelectedProkers(prev => [...prev, prokerId]);

            // Add to form values if not already there
            const existingIndex = watchedProkers.findIndex(p => p.prokerId === prokerId);
            if (existingIndex === -1) {
                const currentProkers = form.getValues("proker");
                form.setValue("proker", [
                    ...currentProkers,
                    { prokerId, diminta: 0 } // Default value
                ]);

                // Add to selected proker
                setSelectedProker([...(selectedProker || []), prokerData.find(p => p.id === prokerId)!]);
            }
        } else {
            setSelectedProkers(prev => prev.filter(id => id !== prokerId));

            // Remove from form values
            const currentProkers = form.getValues("proker");
            form.setValue(
                "proker",
                currentProkers.filter(p => p.prokerId !== prokerId)
            );

            // Remove from selected proker
            setSelectedProker((selectedProker || []).filter(p => p.id !== prokerId));
        }
    };

    const handleDimintaChange = (prokerId: string, value: number) => {
        const currentProkers = form.getValues("proker");
        const index = currentProkers.findIndex(p => p.prokerId === prokerId);

        if (index !== -1) {
            const updatedProkers = [...currentProkers];
            updatedProkers[index] = { ...updatedProkers[index], diminta: value };
            form.setValue("proker", updatedProkers);
        }
    };

    const getProkerDetails = (id: string) => {
        return prokerData.find(p => p.id === id) || null;
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/spp`, values, {
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
                const response = await axios.get(`${BASE_URL}/indicator/recomended?year=${tahun}&unitId=${unitId}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setKpi(response.data.data)
                    form.setValue("periodeSPMUId", periode);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [tahun, unitId, periode, form]);
    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div>
                                    <Select
                                        defaultValue={selectedKpi?.id}
                                        onValueChange={(value) => {
                                            const selectedIndicator = kpi.find(k => k.id === value);
                                            setSelectedKpi(selectedIndicator);
                                            setProkerData(selectedIndicator?.MaOnKpi || []);
                                        }}
                                    >
                                        <Label className="mb-2 pl-1">
                                            Indikator Kinerja
                                        </Label>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Pilih Indikator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kpi.map((kpi) => (
                                                <SelectItem key={kpi.id} value={kpi.id}>
                                                    {kpi.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Proker Selection Table */}
                                <div className="space-y-4">
                                    <FormLabel>Pilih Proker</FormLabel>
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Uraian Proker</TableHead>
                                                    <TableHead>Output Proker</TableHead>
                                                    <TableHead>Anggaran</TableHead>
                                                    <TableHead>Diminta</TableHead>
                                                    <TableHead>Tersisa</TableHead>
                                                    <TableHead className="w-12"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {prokerData.map((proker) => {
                                                    const isSelected = selectedProkers.includes(proker.id);
                                                    const formProker = watchedProkers.find(p => p.prokerId === proker.id);

                                                    return (
                                                        <TableRow key={proker.id}>
                                                            <TableCell>{proker.uraian}</TableCell>
                                                            <TableCell>{proker.output}</TableCell>
                                                            <TableCell>{proker.anggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                            <TableCell>{proker.anggaranDiminta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                            <TableCell>{(proker.anggaran - proker.anggaranDiminta).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                            <TableCell>
                                                                <Checkbox
                                                                    disabled={(proker.anggaran - proker.anggaranDiminta) <= 0}
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) =>
                                                                        handleProkerSelect(proker.id, !!checked)
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {form.formState.errors.proker && (
                                        <p className="text-sm font-medium text-destructive">
                                            {form.formState.errors.proker.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <FormLabel>Proker Pilihan</FormLabel>
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Uraian Proker</TableHead>
                                                    <TableHead>Output Proker</TableHead>
                                                    <TableHead>Anggaran tersedia</TableHead>
                                                    <TableHead>Anggaran yang Diminta</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedProker?.map((proker) => {
                                                    const isSelected = selectedProkers.includes(proker.id);
                                                    const formProker = watchedProkers.find(p => p.prokerId === proker.id);

                                                    return (
                                                        <TableRow key={proker.id}>
                                                            <TableCell>{proker.uraian}</TableCell>
                                                            <TableCell>{proker.output}</TableCell>
                                                            <TableCell>{proker.anggaran.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    disabled={!isSelected}
                                                                    value={formProker?.diminta || 0}
                                                                    onChange={(e) =>
                                                                        handleDimintaChange(proker.id, Number(e.target.value))
                                                                    }
                                                                    className="w-32"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {form.formState.errors.proker && (
                                        <p className="text-sm font-medium text-destructive">
                                            {form.formState.errors.proker.message}
                                        </p>
                                    )}
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
