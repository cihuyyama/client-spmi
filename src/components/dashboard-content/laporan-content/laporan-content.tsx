"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, Laporan, } from "@/lib/types";
import { DataTable } from "./data-table";
import { indicatorColumn } from "./columns";
import { useRouter, useSearchParams } from "next/navigation";
// import HasilReviewUmum from "./hasil-review-umum";
export default function LaporanContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Indicator[]>([]);
  const [laporan, setLaporan] = useState<Laporan>();
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('year') || new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(searchParams.get('unitId') || (userInfo?.unitData[0]?.id ?? "none"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/indicator/by-user?year=${selectedYear}&unitId=${selectedUnit}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setData(response.data.data);
          router.replace(
            `${window.location.protocol}//${window.location.host}/laporan?year=${selectedYear}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedYear, router, userInfo, selectedUnit]);

  useEffect(() => {
    if (!data.length) return;
    const fetchDataLaporan = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/laporan?jadwalId=${data[0].tahun}&unitId=${selectedUnit}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setLaporan(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataLaporan();
  }, [data, selectedUnit]);

  const handleRowClick = (indicatorId: string) => {
    router.push(`/laporan-audit?indicatorId=${indicatorId}`);
  };

  return (
    <>
      <Card className="rounded-lg border-none mt-6 w-full">
        <CardContent className="p-6 w-full">
          <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
            <div className="flex flex-col relative w-full">
              <div className="w-full">
                <DataTable
                  columns={indicatorColumn}
                  data={data}
                  selectedYear={selectedYear}
                  selectedUnit={selectedUnit}
                  setSelectedYear={setSelectedYear}
                  setSelectedUnit={setSelectedUnit}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card className="rounded-lg border-none mt-6 w-full">
        <CardContent className="p-6 w-full">
          <div className="flex justify-center items-start w-full">
            <div className="flex flex-col relative w-full">
              <div className="w-full">
                <HasilReviewUmum
                  tahun={data[0]?.tahun}
                  unitId={selectedUnit}
                  review={review?.reviewUmum ?? ""}
                  tanggapan={review?.tanggapanAkhir ?? ""}
                  id={review?.id ?? ""}
                  indicator={data}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

    </>
  );
}
