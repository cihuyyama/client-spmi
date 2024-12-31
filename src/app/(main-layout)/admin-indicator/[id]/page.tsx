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
import DetailAdminIndicatorContent from "@/components/dashboard-content/admin-indicator-content/detail-indicator/detail-indicator";

export default function DetailIndicatorPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="New Indicator">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin-indicator">Indikator Kinerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailAdminIndicatorContent id={params.id} />
    </ContentLayout>
  );
}
