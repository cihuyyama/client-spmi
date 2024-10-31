"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SubUnit, Unit, UserState } from "@/lib/types";
import UserUnitSubUnitForm from "./user-unit-connection";

export default function UserDetailContent({ id }: { id: string }) {
    const [data, setData] = useState<UserState>();
    const [unit, setUnit] = useState<Unit[]>();
    const [subUnit, setSubUnit] = useState<SubUnit[]>();
    const [roles, setRoles] = useState([])
    const userFormSchema = z.object({
        username: z.string({
            required_error: 'Username is required',
        }).min(1),
        roleId: z.string().nullable().optional(),
    })

    const userForm = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            username: data?.username,
            roleId: data?.role?.id
        },
    })

    function onSubmitUser(values: z.infer<typeof userFormSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/users/${id}`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        setTimeout(() => {
                            userForm.setValue('roleId', values.roleId ?? "");
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
        const fetchDataRole = async () => {
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
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/users/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setData(response.data.data)
                    userForm.setValue('username', data?.username ?? "");
                    userForm.setValue('roleId', data?.role?.id ?? "");
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
                    setUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataSubUnit = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/sub-unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setSubUnit(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };


        fetchData();
        fetchDataRole();
        fetchDataUnit();
        fetchDataSubUnit();
    }, [id, userForm, data?.username, data?.role?.id]);

    return (
        <div>
            <Card className="rounded-lg border-none mt-6 w-full">
                <CardContent className="p-6 w-full">
                    <div className="flex justify-center items-start w-full">
                        <div className="flex flex-col relative w-full">
                            <h1 className="font-semibold text-xl mb-2">
                                User Detail
                            </h1>
                            <Form {...userForm}>
                                <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-8">
                                    <div className="max-w-[400px]">
                                        <FormField
                                            control={userForm.control}
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
                                            control={userForm.control}
                                            name="roleId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={data?.role?.id} value={field.value ?? ""}>
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
                                    <Button type="submit">Save</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-lg border-none mt-6 w-full min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                <CardContent className="p-6 w-full">
                    <div className="flex justify-center items-start w-full">
                        <div className="flex flex-col relative w-full">
                            <div className="flex flex-col justify-between h-full">
                                <div className="w-full flex items-center gap-2 mb-2">
                                    <h1 className="font-semibold text-xl">
                                        Unit & Sub Unit
                                    </h1>
                                    <UserUnitSubUnitForm
                                        userData={data as UserState}
                                        setData={setData}
                                        units={unit ?? []}
                                        subUnits={subUnit ?? []}
                                        connectedUnitIds={data?.unit?.map((unit) => unit.id) ?? []}
                                        connectedSubUnitIds={data?.sub_unit?.map((subUnit) => subUnit.id) ?? []}
                                    />
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col w-1/2">
                                        <h1>
                                            Unit
                                        </h1>
                                        {data?.unit && data?.unit?.map((unit: Unit) => (
                                            <div key={unit.id}>
                                                <Badge>{unit.name}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <h1>
                                            Sub Unit
                                        </h1>
                                        {data?.sub_unit && data?.sub_unit?.map((sub_unit: SubUnit) => (
                                            <div key={sub_unit.id}>
                                                <Badge>{sub_unit.name}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
