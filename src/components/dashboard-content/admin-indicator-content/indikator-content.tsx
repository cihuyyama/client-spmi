"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { DataTable } from "./data-table";
import { indicatorColumn } from "./columns";
import { Indicator } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
export default function AdminIndikatorContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Indicator[]>([]);
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('year') || new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(searchParams.get('unitId') || "all");

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/indicator/by-user?year=${selectedYear}&unitId=${selectedUnit}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          router.replace(`${window.location.protocol}//${window.location.host}` + '/admin-indicator?year=' + selectedYear + '&unitId=' + selectedUnit)
          setData(response.data.data);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [userInfo, selectedYear, router, selectedUnit]);

  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            {userInfo && (
              <div className="w-full">
                <DataTable
                  columns={indicatorColumn}
                  data={data}
                  selectedYear={selectedYear}
                  selectedUnit={selectedUnit}
                  setSelectedYear={setSelectedYear}
                  setSelectedUnit={setSelectedUnit}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
