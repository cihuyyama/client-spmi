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
import ReviewAuditContent from "@/components/dashboard-content/laporan-content/audit-content/audit-content";

export default function LaporanAuditPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="Laporan">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/laporan">Laporan</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Laporan Audit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ReviewAuditContent id={params.id} />
    </ContentLayout>
  );
}
