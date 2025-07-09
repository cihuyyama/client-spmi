"use client"
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { sppColumns } from "./columns";
import { JadwalPencairan, SPP } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function SPPContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<SPP[]>([]);
  const [JadwalPencairan, setJadwalPencairan] = useState<JadwalPencairan>();
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('year') || new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(searchParams.get('unitId') || (userInfo?.unitData[0]?.id ?? "none"));
  const [selectedPeriode, setSelectedPeriode] = useState<string | undefined>(searchParams.get('periode') || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spp] = await Promise.all([
          axios.get(`${BASE_URL}/spp?year=${selectedYear}&unitId=${selectedUnit}&periode=${selectedPeriode}`, {
            withCredentials: true
          })
        ])
        if (spp.status === 200) {
          setData(spp.data.data);
          router.replace(`${window.location.protocol}//${window.location.host}` + '/spp?year=' + selectedYear + '&unitId=' + selectedUnit);
        }
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [userInfo, selectedYear, router, selectedUnit, selectedPeriode]);

  useEffect(() => {
    if (!data) return;
    const fetchDataReview = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jadwal-pencairan/${selectedUnit}/${selectedYear}`, {
          withCredentials: true
        })

        if (response.status === 200) {
          setJadwalPencairan(response.data.data);
          router.replace(`${window.location.protocol}//${window.location.host}` + '/spp?year=' + selectedYear + '&unitId=' + selectedUnit + '&periode=' + selectedPeriode);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataReview();
  }, [data, selectedUnit, selectedYear, selectedPeriode, router]);

  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            {userInfo && (
              <div className="w-full">
                <DataTable
                  columns={sppColumns}
                  data={data}
                  selectedYear={selectedYear}
                  selectedUnit={selectedUnit}
                  selectedPeriode={selectedPeriode}
                  setSelectedYear={setSelectedYear}
                  setSelectedUnit={setSelectedUnit}
                  setSelectedPeriode={setSelectedPeriode}
                  jadwalPencarian={JadwalPencairan}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
