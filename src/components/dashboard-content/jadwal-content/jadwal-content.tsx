"use client"
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { Jadwal } from "@/lib/types";
import { DataTable } from "./data-table";
import { jadwalColumn } from "./columns";
export default function JadwalContent() {
  const [data, setData] = useState<Jadwal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/jadwal`, {
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
  }, []);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            <div className="w-full">
              <DataTable 
              columns={jadwalColumn}
              data={data}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
