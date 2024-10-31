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

export default function NewUserContent() {
    const [roles, setRoles] = useState([])
    const router = useRouter();
    const formSchema = z.object({
        username: z.string({
            required_error: 'Username is required',
        }).min(1),
        password: z.string({
            required_error: 'Password is required',
        }).min(6),
        roleId: z.string().nullable().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
            roleId: undefined
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.post(`${BASE_URL}/auth/register`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            router.push('/users')
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
                const response = await axios.get(`${BASE_URL}/roles`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setRoles(response.data.data)
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
                                <div className="max-w-[400px]">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Username" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Password" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="roleId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {roles.map((role: any) => (
                                                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
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
