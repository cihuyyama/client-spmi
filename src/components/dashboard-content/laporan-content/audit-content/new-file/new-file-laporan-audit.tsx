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
import { Indicator, Laporan } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

export default function NewFileLaporanAuditContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedIndicatorId = searchParams.get("indicatorId");
    const [selectedIndicator, setSelectedIndicator] = useState<Indicator>();
    const selectedLaporanId = searchParams.get("laporanId");
    const [selectedLaporan, setSelectedLaporan] = useState<Laporan>();

    const formSchema = z.object({
        laporanId: z.string().min(1, "laporanId is required"), // Changed to string validation
        file: z.instanceof(File).refine((file) => file.size > 0, "File is required"), // File validation
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            laporanId: selectedLaporanId ?? "",
        },
    });

    // Fungsi submit
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted with values:", values);  // Tambahkan ini
        try {
            const formData = new FormData();
            formData.append("laporanId", values.laporanId);
            formData.append("file", values.file);

            const response = await axios.post(`${BASE_URL}/file/`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success("Berhasil menyimpan data");
            } else {
                toast.error("Gagal menyimpan data");
            }
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || (error as any).message;
            console.error("Error:", errorMessage);  // Tambahkan ini
            toast.error(`Gagal menyimpan data: ${errorMessage}`);
        }
    }


    // Fetch laporan yang dipilih berdasarkan ID
    useEffect(() => {
        if (!selectedLaporanId) return;

        const fetchIndicator = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/laporan/${selectedLaporanId}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setSelectedLaporan(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching indicator:", error);
            }
        };

        fetchIndicator();
    }, [selectedLaporanId]);

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="md:min-w-[400px] space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                                    />
                                                </FormControl>
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
