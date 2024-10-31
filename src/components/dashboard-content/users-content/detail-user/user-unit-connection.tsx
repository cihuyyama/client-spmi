import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SubUnit, Unit, UserState } from '@/lib/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { BASE_URL } from '@/constant/BaseURL';
const userFormSchema = z.object({
    unitIds: z.array(z.string({
        required_error: 'Unit ID is required',
    })),
    subUnitIds: z.array(z.string({
        required_error: 'Sub Unit ID is required',
    })),
});

interface FormProps {
    units: Unit[];
    subUnits: SubUnit[];
    connectedUnitIds: string[];
    connectedSubUnitIds: string[];
    userData: UserState
    setData: Dispatch<SetStateAction<UserState | undefined>>
}

const UserUnitSubUnitForm: React.FC<FormProps> = ({
    units,
    subUnits,
    connectedUnitIds,
    connectedSubUnitIds,
    userData,
    setData
}) => {
    const userForm = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            unitIds: connectedUnitIds,
            subUnitIds: connectedSubUnitIds,
        },
    });

    const onSubmit = (data: z.infer<typeof userFormSchema>) => {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/users/${userData.id}/unit`, data, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: () => {
                        let newData = { ...userData };
                        newData.unit = units.filter((unit) => data.unitIds.includes(unit.id));
                        newData.sub_unit = subUnits.filter((subUnit) => data.subUnitIds.includes(subUnit.id));
                        console.log(newData);
                        setData(newData);
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

    };

    useEffect(() => {
        userForm.setValue('unitIds', connectedUnitIds);
        userForm.setValue('subUnitIds', connectedSubUnitIds);
    }, [connectedUnitIds, connectedSubUnitIds, userForm]);

    return (
        <div className='w-fit'>
            <Dialog>
                <DialogTrigger>
                    <Button>
                        Edit Unit
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Unit and Sub-Unit</DialogTitle>
                        <DialogDescription>
                            Edit the unit and sub-unit that the user has access to
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
                            {/* Unit Multi-Select */}
                            <FormField
                                control={userForm.control}
                                name="unitIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Units</FormLabel>
                                        <FormControl>
                                            <Select
                                                isMulti
                                                options={units.map((unit) => ({
                                                    value: unit.id,
                                                    label: unit.name,
                                                }))}
                                                value={userForm.getValues('unitIds').map((id) => {
                                                    const unit = units.find((u) => u.id === id);
                                                    return unit ? { value: unit.id, label: unit.name } : null;
                                                })}
                                                defaultValue={connectedUnitIds.map((id) => {
                                                    const unit = units.find((u) => u.id === id);
                                                    return unit ? { value: unit.id, label: unit.name } : null;
                                                })}
                                                onChange={(selectedOptions) => {
                                                    const selectedUnitIds = selectedOptions
                                                        .filter((option) => option !== null)
                                                        .map((option) => option!.value);
                                                    userForm.setValue('unitIds', selectedUnitIds);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* SubUnit Multi-Select */}
                            <FormField
                                control={userForm.control}
                                name="subUnitIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Sub Units</FormLabel>
                                        <FormControl>
                                            <Select
                                                isMulti
                                                options={subUnits.map((subUnit) => ({
                                                    value: subUnit.id,
                                                    label: subUnit.name,
                                                }))}
                                                value={userForm.getValues('subUnitIds').map((id) => {
                                                    const subUnit = subUnits.find((su) => su.id === id);
                                                    return subUnit ? { value: subUnit.id, label: subUnit.name } : null;
                                                })}
                                                defaultValue={connectedSubUnitIds.map((id) => {
                                                    const subUnit = subUnits.find((su) => su.id === id);
                                                    return subUnit ? { value: subUnit.id, label: subUnit.name } : null;
                                                })}
                                                onChange={(selectedOptions) => {
                                                    const selectedSubUnitIds = selectedOptions
                                                        .filter((option) => option !== null)
                                                        .map((option) => option!.value);
                                                    userForm.setValue('subUnitIds', selectedSubUnitIds);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Save</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserUnitSubUnitForm;