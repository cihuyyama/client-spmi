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
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SelectReact from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { Unit, UserState } from "@/lib/types";

export default function DetailUserContent({ id }: { id: string }) {
    const [roles, setRoles] = useState([])
    const [user, setUser] = useState<UserState>()
    const [units, setUnits] = useState<Unit[]>([])
    const router = useRouter();
    const formSchema = z.object({
        username: z.string({
            required_error: 'Username is required',
        }),
        roleId: z.string().optional(),
        unitIds: z.array(z.string({
            required_error: 'Unit ID is required',
        })).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            roleId: user?.role?.id || undefined,
            unitIds: user?.unit.map((unit) => unit.id) || [],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/users/${id}`, values, {
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
        const fetchDataUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setUser(response.data.data)
                    form.setValue('username', response.data.data.username)
                    form.setValue('roleId', response.data.data.role.id)
                    form.setValue('unitIds', response.data.data.unit.map((unit: Unit) => unit.id))
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataUnit = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setUnits(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchData();
        fetchDataUser();
        fetchDataUnit();
    }, [id, form])

    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="max-w-[400px] space-y-4">
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
                                        name="roleId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {roles.map((role: any) => (
                                                            <SelectItem key={role.id} value={role.id}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unitIds"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit (Optional)</FormLabel>
                                                <FormControl>
                                                    <SelectReact
                                                        isMulti
                                                        options={units?.map((unit) => ({
                                                            value: unit.id,
                                                            label: unit.name,
                                                        }))}
                                                        value={form.getValues('unitIds')?.map((id) => {
                                                            const unit = units.find((u) => u.id === id);
                                                            return unit ? { value: unit.id, label: unit.name } : null;
                                                        })}
                                                        defaultValue={user?.unit?.map((data) => {
                                                            const unit = units.find((u) => u.id === data.id);
                                                            return data ? { value: data.id, label: data.name } : null;
                                                        })}
                                                        onChange={(selectedOptions) => {
                                                            const selectedUnitIds = selectedOptions
                                                                .filter((option) => option !== null)
                                                                .map((option) => option!.value);
                                                            form.setValue('unitIds', selectedUnitIds);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit">
                                    Simpan
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
