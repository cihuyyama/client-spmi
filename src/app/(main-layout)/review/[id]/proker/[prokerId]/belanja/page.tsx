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
import ReviewPembelianContent from "@/components/dashboard-content/review-content/proker-content/pembelian-content/pembelian-content";

export default function PembelianPage({ params }: { params: { id: string, prokerId: string } }) {
  return (
    <ContentLayout title="Penyusunan Program Kerja">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/review">Review Indikator Kinerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/review/${params.id}/proker`}>Review Program Kerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Belanja</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ReviewPembelianContent id={params.id} prokerId={params.prokerId} />
    </ContentLayout>
  );
}
