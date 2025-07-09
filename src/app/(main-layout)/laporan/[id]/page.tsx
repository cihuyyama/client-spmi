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
import DetailLaporanContent from "@/components/dashboard-content/laporan-content/audit-content/detail/detail-laporan";

export default function DetailLaporanPage({ params }: { params: { id: string } }) {
    return (
        <ContentLayout title="Master">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/laporan">Laporan</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Detail</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <DetailLaporanContent id={params.id} />
        </ContentLayout>
    );
}
