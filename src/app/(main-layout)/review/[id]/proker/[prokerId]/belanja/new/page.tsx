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
import NewPembelianContent from "@/components/dashboard-content/indikator-content/ma-to-indicator/pembelian-content/new/new-pembelian";

export default function PembelianPage({ params }: { params: { id: string, prokerId: string } }) {
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
            <BreadcrumbLink asChild>
              <Link href={`/indicator/${params.id}/ma-to-indicator`}>Program Kerja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/indicator/${params.id}/ma-to-indicator/${params.prokerId}/belanja`}>Belanja</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Belanja</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <NewPembelianContent id={params.id} prokerId={params.prokerId} />
    </ContentLayout>
  );
}
