import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { DataTable } from "./data-table";
import { vmColumn } from "./columns";
import { VisiMisi } from "@/lib/types";

export default function VisiMisiContent() {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [data, setData] = useState<VisiMisi[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(new Date().getFullYear().toString());
    const filteredData = data.filter((item) => {
        return item.tahun === selectedYear
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/visi-misi/by-user`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    // @ts-ignore
                    setData(response.data.data.sort((a, b) => b.tahun.localeCompare(a.tahun)))
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
                        {userInfo && (
                            <div className="w-full">
                                <DataTable columns={vmColumn} data={filteredData} setSelectedYear={setSelectedYear} />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
