"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import UsersContent from "@/components/dashboard-content/users-content/users-content";

export default function UsersPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Users
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <UsersContent />
    </ContentLayout>
  );
}
