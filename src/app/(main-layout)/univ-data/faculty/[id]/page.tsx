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
import NewUnitContent from "@/components/dashboard-content/univ-data-content/faculty-content/new/new-unit-content";
import DetailUnitContent from "@/components/dashboard-content/univ-data-content/faculty-content/detail/detail-unit-content";

export default function DetailUnitPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="New Unit">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/univ-data/faculty">Data Unit</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailUnitContent id={params.id} />
    </ContentLayout>
  );
}
