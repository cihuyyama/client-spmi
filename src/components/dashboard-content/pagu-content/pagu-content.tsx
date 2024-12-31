"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { Jadwal, PaguAnggaran } from "@/lib/types";
import { paguColumn } from "./columns";
import { DataTable } from "./data-table";
import { useRouter, useSearchParams } from "next/navigation";
export default function PaguContent() {
  const [data, setData] = useState<PaguAnggaran[]>([]);
  const searchParams = useSearchParams()
  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('tahun') || new Date().getFullYear().toString());
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/pagu?tahun=${selectedYear}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          router.replace(`${window.location.protocol}//${window.location.host}` + '/pagu?tahun=' + selectedYear)
          setData(response.data.data);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [selectedYear, router]);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">
              <DataTable
              columns={paguColumn}
              data={data}
              setSelectedYear={setSelectedYear}
              selectedYear={selectedYear}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
