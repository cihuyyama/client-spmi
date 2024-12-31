"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator, MataAnggaran, MatoIndicator, PaguAnggaran } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { belanjaColumn } from "./columns";
import { DataTable } from "./data-table";
import { Separator } from "@/components/ui/separator";

export default function PembelianContent({ id, prokerId }: { id: string, prokerId: string }) {
  const [data, setData] = useState<MatoIndicator>();
  const [kpi, setKpi] = useState<Indicator>();
  const [ma, setMa] = useState<MataAnggaran>();
  const [pagu, setPagu] = useState<PaguAnggaran>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ma-to-indicator/${prokerId}/proker`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data);
          setKpi(response.data.meta.kpi);
          setMa(response.data.meta.ma);
          setPagu(response.data.meta.pagu);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [prokerId]);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">

              <div className="flex flex-row gap-4 text-sm">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      Kode Indikator
                    </span>
                    <span className="font-semibold">
                      Pernyataan Indikator
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      Kode Mata Anggaran
                    </span>
                    <span className="font-semibold">
                      Pernyataan Mata Anggaran
                    </span>
                    <span className="font-semibold">
                      Nama Kegiatan
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span>
                      : {kpi && kpi.kpiCode}
                    </span>
                    <span>
                      : {kpi && kpi.name}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      : {ma && ma.maCode}
                    </span>
                    <span>
                      : {ma && ma.name}
                    </span>
                    <span>
                      : {data && data.uraian}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="mt-4 font-bold">
                Informasi Pagu
              </h1>
              <Separator orientation="horizontal" className="mb-4" />
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

              <DataTable columns={belanjaColumn} data={data?.Pembelian ?? []} id={id} prokerId={prokerId} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
