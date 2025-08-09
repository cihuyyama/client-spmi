"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { updateUser } from "@/lib/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useEffect } from "react";
import { Badge } from "../ui/badge";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const endDateString = userInfo?.unit[0]?.Jadwal[0]?.endDate ?? '';
  const endDate = new Date(endDateString);
  const formattedEndDate = endDate.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
  const exceedsEndDate = new Date().getTime() > endDate.getTime();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users`, {
          withCredentials: true
        })
        if (response.status === 200) {
          dispatch(
            updateUser(response.data.data)
          )
        }
        return response.data;
      } catch (error) {
        return error;
      }
    };

    // if (!userInfo) {
    // }
    fetchData();

  }, [dispatch]);

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {userInfo && (
            <div className="flex items-center space-x-2">
              {
              // userInfo?.unit[0]?.Jadwal && userInfo.role?.permissions[0].name === "ADMIN_UNIT" && userInfo.role.permissions.length == 1 && 
              (
                <div className="flex flex-row justify-center items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold">
                      Jadwal
                    </span>
                    <span className="text-sm">
                      <Badge>
                        {userInfo?.unit[0]?.Jadwal[0]?.name}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col pr-4">
                    <span className="text-[11px]">
                      Tanggal berakhir
                    </span>
                    <span className="text-[11px] font-semibold">
                      <Badge className={exceedsEndDate ? 'bg-red-600' : 'bg-green-600'}>
                        {formattedEndDate}
                      </Badge>
                    </span>
                  </div>
                </div>
              )}

              <span>Role : {userInfo?.role?.name}</span>
              <span>User : {userInfo?.username}</span>
            </div>
          )}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
