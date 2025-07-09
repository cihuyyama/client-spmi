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
import DetailEntryProgresContent from "@/components/dashboard-content/spj-content/entry-progres-content/detail/detail-entry-progres";

export default function DetailEntryProgresPage({ params }: { params: { prokerId: string } }) {
  return (
    <ContentLayout title="Pertanggungjawaban Anggaran">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spj/progres">Entry Progres Kegiatan</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailEntryProgresContent prokerId={params.prokerId}  />
    </ContentLayout>
  );
}
