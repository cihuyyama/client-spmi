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

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();


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

    if (!userInfo) {
      fetchData();
    }

  }, [dispatch, userInfo]);
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
