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
import DetailEntrySPJContent from "@/components/dashboard-content/spj-content/entry-spj-content/detail/detail-entry-spj";

export default function DetailEntrySPJPage({ params }: { params: { prokerId: string } }) {
  return (
    <ContentLayout title="Pertanggungjawaban Anggaran">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spj/entry-spj">Entry SPJ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailEntrySPJContent prokerId={params.prokerId}  />
    </ContentLayout>
  );
}
