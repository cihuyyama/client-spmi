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
import NewSPMUContent from "@/components/dashboard-content/spmu-content/new-spmu/new-spmu-content";

export default function NewSPMUPage({ params }: { params: { tahun: string, periode: string, unitId: string } }) {
  return (
    <ContentLayout title="Pencairan Dana">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/spmu">SPMU</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <NewSPMUContent tahun={params.tahun} periode={params.periode} unitId={params.unitId} />
    </ContentLayout>
  );
}
