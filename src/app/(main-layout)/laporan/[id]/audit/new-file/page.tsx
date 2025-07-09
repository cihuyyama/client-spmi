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
import NewFileLaporanAuditContent from "@/components/dashboard-content/laporan-content/audit-content/new-file/new-file-laporan-audit";

export default function NewFileLaporanAuditPage() {
    return (
        <ContentLayout title="Master">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/laporan">File Laporan Audit</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>New File</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <NewFileLaporanAuditContent />
        </ContentLayout>
    );
}
