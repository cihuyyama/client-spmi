"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, Laporan } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { laporanColumn } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useSearchParams } from "next/navigation";

export default function LaporanAuditContent({ id }: { id: string }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const unitId = userInfo?.unitData.length === 1 ? userInfo.unitData[0].id : undefined;
  const [data, setData] = useState<Laporan[]>([]);
  const searchParams = useSearchParams();
  const indicatorId = searchParams.get("indicatorId");
  const [indicator, setIndicator] = useState<Indicator>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/laporan?indicatorId=${indicatorId}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, indicatorId, unitId]);

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/indicator/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setIndicator(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching indicator data:", error);
      }
    };

    fetchIndicator();
  }, [id]);
  return (
    <>
      <Card className="rounded-lg border-none mt-6 w-full">
        <CardContent className="p-6 w-full">
          <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
            <div className="flex flex-col relative w-full">
              <div className="w-full">

                <div className="flex flex-row gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold">Kode Indikator</span>
                    <span className="font-semibold">Pernyataan Indikator</span>
                  </div>

                  <div className="flex flex-col">
                    <span>{indicator?.kpiCode || "-"}</span>
                    <span>{indicator?.name || "-"}</span>
                  </div>


                  <div className="flex flex-col pl-10">
                    <span className="font-semibold">Tahun</span>
                    <span className="font-semibold">Target</span>
                  </div>

                  <div className="flex flex-col">
                    <span>{indicator?.tahun || "-"}</span>
                    <span>{indicator?.target || "-"}</span>
                  </div>

                  <div className="flex flex-col pl-10">
                    <span className="font-semibold">Progress Capaian</span>
                    <span className="font-semibold">Persen Capaian</span>
                  </div>

                  <div className="flex flex-col">
                    {/* <span>{indicator?.kpiCode || "-"}</span>
                    <span>{indicator?.name || "-"}</span> */}
                    <span>{data.length > 0 ? data[0].capaian : "-"}</span>
                    <span>{data.length > 0 && indicator?.target ? ((Number(data[0].capaian) / Number(indicator.target)) * 100).toFixed(2) + "%" : "-"}</span>
                  </div>

                </div>

                <DataTable columns={laporanColumn} data={data} id={id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card >
    </>
  );
}
