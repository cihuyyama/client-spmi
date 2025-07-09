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
import AdminIndikatorContent from "@/components/dashboard-content/laporan-content/laporan-content";

export default function LaporanPage() {

  return (
    <ContentLayout title="Laporan">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Laporan
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AdminIndikatorContent />
    </ContentLayout>
  );
}
