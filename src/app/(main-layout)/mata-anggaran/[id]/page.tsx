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
import DetailMataAnggaranContent from "@/components/dashboard-content/mata-anggaran-content/detail/detail-mata-anggaran";

export default function DetailMataAnggaranPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="Master">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/mata-anggaran">Mata Anggaran</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailMataAnggaranContent id={params.id} />
    </ContentLayout>
  );
}
