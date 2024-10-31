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
import JenisRekeningContent from "@/components/dashboard-content/jenis-rekening-content/jenis-rekening-content";

export default function MataRekeningPage() {

  return (
    <ContentLayout title="Master">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Jenis Rekening
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <JenisRekeningContent />
    </ContentLayout>
  );
}
