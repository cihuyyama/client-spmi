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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { Permission } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function NewRoleContent() {
    const [permissions, setPermissons] = useState<Permission[]>([])
    const router = useRouter();
    const formSchema = z.object({
        name: z.string({
            required_error: 'Name role is required',
        }).min(1, {
            message: 'Name role is required',
        }),
        permissions: z.array(z.string()).nullable().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            permissions: []
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/roles`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/roles')
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
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/permissions`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setPermissons(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchData();
    }, [])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-8 w-full">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="w-fit md:min-w-[350px]">
                                                <FormLabel>Role Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Role Name" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col w-full">
                                        {permissions.map((permission) => (
                                            <FormField
                                                key={permission.id}
                                                control={form.control}
                                                name="permissions"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(permission.name)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentPermissions = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...currentPermissions, permission.name]);
                                                                    } else {
                                                                        field.onChange(
                                                                            currentPermissions.filter((p) => p !== permission.name)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>{permission.name}</FormLabel>
                                                            <FormDescription>{permission.description}</FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>

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
