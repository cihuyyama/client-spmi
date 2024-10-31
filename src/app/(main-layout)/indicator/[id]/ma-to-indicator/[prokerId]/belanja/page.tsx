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
import PembelianContent from "@/components/dashboard-content/indikator-content/ma-to-indicator/pembelian-content/pembelian-content";

export default function PembelianPage({ params }: { params: { id: string, prokerId: string } }) {
  return (
    <ContentLayout title="Penyusunan Anggaran">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/indicator">Indikator Kinerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/indicator/${params.id}/ma-to-indicator`}>Program Kerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Belanja</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PembelianContent id={params.id} prokerId={params.prokerId} />
    </ContentLayout>
  );
}
