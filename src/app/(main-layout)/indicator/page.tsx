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
import IndikatorContent from "@/components/dashboard-content/indikator-content/indikator-content";

export default function IndikatorPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <ContentLayout title="Penyusunan Program Kerja">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Indikator Kinerja
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <IndikatorContent />
    </ContentLayout>
  );
}
