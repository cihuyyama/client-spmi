"use client"

import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/constant/BaseURL";
import { MataAnggaran, MatoIndicator } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { belanjaColumn } from "./columns";
import { DataTable } from "./data-table";

export default function PembelianContent({ id, prokerId }: { id: string, prokerId: string }) {
  const [data, setData] = useState<MatoIndicator>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ma-to-indicator/${prokerId}/proker`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data);
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [prokerId]);
  console.log(data)
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">
              <DataTable columns={belanjaColumn} data={data?.Pembelian ?? []} id={id} prokerId={prokerId} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
