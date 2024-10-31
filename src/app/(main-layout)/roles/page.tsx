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
import RoleContent from "@/components/dashboard-content/role-content/role-content";

export default function RolePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Role
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <RoleContent />
    </ContentLayout>
  );
}
