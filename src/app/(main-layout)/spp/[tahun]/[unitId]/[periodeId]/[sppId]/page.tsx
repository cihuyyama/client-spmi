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
import DetailSPPContent from "@/components/dashboard-content/spp-content/detail/detail-spp";

export default function NewSPPPage({ params }: { params: { tahun: string, periodeId: string, unitId: string, sppId: string } }) {
  return (
    <ContentLayout title="Pencairan Dana">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spp">SPP</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailSPPContent tahun={params.tahun} periodeId={params.periodeId} unitId={params.unitId} sppId={params.sppId} />
    </ContentLayout>
  );
}
