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
import BidangContent from "@/components/dashboard-content/bidang-content/bidang-content";

export default function BidangPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <ContentLayout title="Data">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Bidang
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BidangContent />
    </ContentLayout>
  );
}
