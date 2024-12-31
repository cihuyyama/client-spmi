"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, MataAnggaran } from "@/lib/types";
import { DataTable } from "./data-table";
import { maColumn } from "./columns";
import { useRouter, useSearchParams } from "next/navigation";
export default function MataAnggaranContent() {
  const [data, setData] = useState<MataAnggaran[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('year') || new Date().getFullYear().toString());
  const [selectedIndicator, setSelectedIndicator] = useState<string>(searchParams.get('indicatorId') || "all");
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/mata-anggaran?year=${selectedYear}&indicatorId=${selectedIndicator}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          router.replace(`${window.location.protocol}//${window.location.host}` + '/mata-anggaran?year=' + selectedYear + '&indicatorId=' + selectedIndicator)
          setData(response.data.data);
        }
      } catch (error) {
        return error;
      }
    };
    const fetchDataIndicator = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/indicator?year=${selectedYear}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setIndicators(response.data.data);
        }
      } catch (error) {
        return error;
      }
    };

    fetchData();
    fetchDataIndicator();
  }, [selectedYear, router, selectedIndicator]);

  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">
              <DataTable
                columns={maColumn}
                data={data}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedUnit={selectedIndicator}
                setSelectedUnit={setSelectedIndicator}
                indicators={indicators}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
