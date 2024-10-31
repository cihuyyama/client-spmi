"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { departmentColumns } from "./columns";


export default function DepartmentContent() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/sub-unit`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setData(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchData();
    }, []);
    return (
        <Card className="rounded-lg border-none mt-6 w-full">
            <CardContent className="p-6 w-full">
                <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
                    <div className="flex flex-col relative w-full">
                        <DataTable data={data} columns={departmentColumns} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}