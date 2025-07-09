"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, MataAnggaran, MatoIndicator, PaguAnggaran, SPP, Unit } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { detailSPPColumns } from "./columns";

export default function DetailSPPContent({ unitId, periodeId, sppId, tahun }: { unitId: string, periodeId: string, sppId: string, tahun: string }) {
  const [data, setData] = useState<MatoIndicator[]>([]);
  const [spp, setSpp] = useState<SPP>();
  const [unit, setUnit] = useState<Unit>();
  const tanggalPengajuanSPP = new Date(spp?.createdAt ?? "").toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/spp/${unitId}/${periodeId}/${sppId}/${tahun}`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data);
          setSpp(response.data.data[0].Unit.JadwalPencairan[0].PeriodeSPMU[0].SPP[0]);
          setUnit(response.data.data[0].Unit);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [unitId, periodeId, sppId, tahun]);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">

              <div className="flex flex-row gap-4 text-sm my-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      No. SPP
                    </span>
                    <span className="font-semibold">
                      Unit Kerja
                    </span>
                    <span className="font-semibold">
                      Tanggal Pengajuan SPP
                    </span>
                    <span className="font-semibold">
                      Tahun Anggaran
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span>
                      : {spp && spp.noSpp}
                    </span>
                    <span>
                      : {data && unit?.name}
                    </span>
                    <span>
                      : {spp && tanggalPengajuanSPP}
                    </span>
                    <span>
                      : {tahun && tahun}
                    </span>
                  </div>
                </div>
              </div>

              {/* <h1 className="mt-4 font-bold">
                Informasi Pagu
              </h1>
              <Separator orientation="horizontal" className="mb-4" />
              <div className="w-full flex flex-row mt-4 justify-end text-sm">
                <div className="flex flex-row">
                  <span>
                    <span className="font-semibold">{`Pagu Anggaran : `}</span>{pagu?.pagu?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
              <Separator orientation="horizontal" className="mt-4" /> */}

              <DataTable columns={detailSPPColumns} data={data ?? []} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
