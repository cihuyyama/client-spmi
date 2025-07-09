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
import NewSPPContent from "@/components/dashboard-content/spp-content/new-spp/new-spp-content";

export default function NewSPPPage({ params }: { params: { tahun: string, periode: string, unitId: string } }) {
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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <NewSPPContent tahun={params.tahun} periode={params.periode} unitId={params.unitId} />
    </ContentLayout>
  );
}
