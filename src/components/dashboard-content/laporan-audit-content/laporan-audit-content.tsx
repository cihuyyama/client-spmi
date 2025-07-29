"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { Indicator } from "@/lib/types";
import { AuditTable } from "./table";
import { auditColumns } from "./columns";

export default function LaporanAuditContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Indicator[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedUnit, setSelectedUnit] = useState<string>(userInfo?.unitData[0]?.id ?? "none");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/indicator/by-user?year=${selectedYear}&unitId=${selectedUnit}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedYear, selectedUnit]);

  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6 w-full">
        <AuditTable
          columns={auditColumns}
          data={data}
          selectedYear={selectedYear}
          selectedUnit={selectedUnit}
          setSelectedYear={setSelectedYear}
          setSelectedUnit={setSelectedUnit}
        />
      </CardContent>
    </Card>
  );
}
