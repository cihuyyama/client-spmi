"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { DataTable } from "./data-table";
import { indicatorColumn } from "./columns";
import { Indicator, PaguAnggaran } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
export default function IndikatorContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Indicator[]>([]);
  const [pagu, setPagu] = useState<PaguAnggaran>();
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedYear, setSelectedYear] = useState<string | undefined>(searchParams.get('year') || new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(searchParams.get('unitId') || (userInfo?.unitData[0]?.id ?? "all"));

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/indicator/by-user?year=${selectedYear}&unitId=${selectedUnit}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          router.replace(`${window.location.protocol}//${window.location.host}` + '/indicator?year=' + selectedYear + '&unitId=' + selectedUnit)
          setData(response.data.data);
          setPagu(response.data.meta.pagu);
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

            <h1 className="mt-4 font-bold">
              Informasi Pagu
            </h1>
            <Separator orientation="horizontal" className="" />
            <div className="w-full flex flex-row mt-4 justify-end text-sm">
              <div className="flex flex-row">
                <span>
                  <span className="font-semibold">{`Pagu Anggaran : `}</span>{pagu?.pagu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
              </div>
              <Separator orientation="vertical" className="mx-2 w-[2px]" />
              <div className="flex flex-row">
                <span>
                  <span className="font-semibold">{`Anggaran Terpakai : `}</span>{pagu?.Pembelian?.reduce((acc, curr) => acc + Number(curr.jumlah), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
              </div>
              <Separator orientation="vertical" className="mx-2 w-[2px]" />
              <div className="flex flex-row">
                <span>
                  <span className="font-semibold">{`Sisa Anggaran : `}</span>{(Number(pagu?.pagu ?? 0) - (pagu?.Pembelian?.reduce((acc, curr) => acc + Number(curr.jumlah), 0) ?? 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
              </div>
            </div>
            <Separator orientation="horizontal" className="mt-4" />

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
