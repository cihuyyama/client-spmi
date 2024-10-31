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
import DetailSubUnitContent from "@/components/dashboard-content/univ-data-content/department-content/detail/detail-sub-unit-content";

export default function DetailSubUnitPage({ params }: { params: { id: string } }) {
  return (
    <ContentLayout title="New Unit">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/univ-data/department">Data SubUnit</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DetailSubUnitContent id={params.id} />
    </ContentLayout>
  );
}
