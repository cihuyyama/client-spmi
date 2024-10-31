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
export default function IndikatorContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Indicator[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | undefined>(new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(userInfo?.unitData[0]?.id ?? "all");

  const filteredData = data.filter((item) => {
    if (selectedUnit === "all") {
      return item.year === selectedYear
    }
    return item.year === selectedYear && (item.primary_pic.id === selectedUnit || item.secondary_pic.id === selectedUnit)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/indicator/by-user`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data);
          setSelectedUnit(userInfo?.unitData[0]?.id ?? "all");
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [userInfo]);
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] w-full">
          <div className="flex flex-col relative w-full">
            {userInfo && (
              <div className="w-full">
                <DataTable
                  columns={indicatorColumn}
                  data={filteredData}
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
