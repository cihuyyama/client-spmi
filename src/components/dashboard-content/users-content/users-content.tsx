"use client"

import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { userColumns } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";

export default function UsersContent() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_URL}/users/all`, {
          withCredentials: true
        })
        if (response.status === 200) {
          setData(response.data.data)
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
            {userInfo && (
              <div className="w-full">
                <DataTable columns={userColumns} data={data} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}