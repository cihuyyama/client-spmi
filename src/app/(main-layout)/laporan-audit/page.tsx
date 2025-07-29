"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import LaporanAuditContent from "@/components/dashboard-content/laporan-audit-content/laporan-audit-content";

export default function LaporanAuditPage() {
  return (
    <ContentLayout title="Laporan Audit">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Laporan Audit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <LaporanAuditContent />
    </ContentLayout>
  );
}
