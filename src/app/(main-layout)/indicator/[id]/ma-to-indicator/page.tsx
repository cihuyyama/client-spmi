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
import MAtoIndicatorContent from "@/components/dashboard-content/indikator-content/ma-to-indicator/mata-anggaran-content";

export default function MAtoIndicatorPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="Penyusunan Program Kerja">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/indicator">Indikator Kinerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Program Kerja</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MAtoIndicatorContent id={params.id} />
    </ContentLayout>
  );
}
