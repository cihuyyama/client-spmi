"use client"
import { BASE_URL } from "@/constant/BaseURL";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Indicator } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

export default function NewLaporanAuditContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedIndicatorId = searchParams.get("indicatorId");
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator>();

    const formSchema = z.object({
        indikatorId: z.string({
            required_error: "Indikator ID harus diisi",
        }),
        capaian: z.string({
            required_error: "Capaian harus diisi",
        }),
        kendala: z.string({
            required_error: "Kendala harus diisi",
        }),
        perbaikan: z.string({
            required_error: "Perbaikan harus diisi",
        }),
        rtl: z.string({
            required_error: "RTL harus diisi",
        }),
        pic: z.string({
            required_error: "PIC harus diisi",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            indikatorId: selectedIndicatorId ?? "",
        },
    });

    // Fungsi submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted with values:", values);  // Tambahkan ini
        try {
            const response = await axios.post(`${BASE_URL}/laporan/`, values, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success("Berhasil menyimpan data");
                router.push(`/laporan/${selectedIndicatorId}/audit?indicatorId=${selectedIndicatorId}`);
            } else {
                toast.error("Gagal menyimpan data");
            }
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || (error as any).message;
            console.error("Error:", errorMessage);  // Tambahkan ini
            toast.error(`Gagal menyimpan data: ${errorMessage}`);
        }
    }


    // Fetch indikator yang dipilih berdasarkan ID
    useEffect(() => {
        if (!selectedIndicatorId) return;

        const fetchIndicator = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/indicator/${selectedIndicatorId}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setSelectedIndicator(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching indicator:", error);
            }
        };

        fetchIndicator();
    }, [selectedIndicatorId]);

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="md:min-w-[400px] space-y-4">
                                    {/* Input hidden untuk indikatorId */}
                                    <FormField
                                        control={form.control}
                                        name="indikatorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="hidden" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tampilkan nama indikator yang dipilih */}
                                    {selectedIndicator && (
                                        <div className="mb-4">
                                            <p><strong>Kode Indikator:</strong> {selectedIndicator.kpiCode}</p>
                                            <p><strong>Nama Indikator:</strong> {selectedIndicator.name}</p>
                                        </div>
                                    )}

                                    {/* Capaian */}
                                    <FormField
                                        control={form.control}
                                        name="capaian"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capaian</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Capaian" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Kendala */}
                                    <FormField
                                        control={form.control}
                                        name="kendala"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kendala</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Masukkan kendala" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Perbaikan */}
                                    <FormField
                                        control={form.control}
                                        name="perbaikan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Perbaikan</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Perbaikan" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* RTL */}
                                    <FormField
                                        control={form.control}
                                        name="rtl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>RTL</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="RTL" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* PIC */}
                                    <FormField
                                        control={form.control}
                                        name="pic"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PIC</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="PIC" {...field} />
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
