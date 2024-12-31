"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, MataAnggaran, MatoIndicator } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { maColumn } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function MAtoIndicatorContent({ id }: { id: string }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const unitId = userInfo?.unitData.length === 1 ? userInfo.unitData[0].id : undefined;
  const [data, setData] = useState<MatoIndicator[]>([]);
  const [kpi, setKpi] = useState<Indicator>();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/ma-to-indicator/${id}/unit/${unitId}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data);
          setKpi(response.data.meta.kpi);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [id, unitId]);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">

              <div className="flex flex-row gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    Kode Indikator
                  </span>
                  <span className="font-semibold">
                    Pernyataan Indikator
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span>
                    {kpi && kpi.kpiCode}
                  </span>
                  <span>
                    {kpi && kpi.name}
                  </span>
                </div>
              </div>

              <DataTable columns={maColumn} data={data} id={id} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
