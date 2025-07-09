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
import NewJadwalContent from "@/components/dashboard-content/jadwal-laporan-content/new-jadwal-laporan/new-jadwal-laporan";

export default function NewJadwalPage() {
    return (
        <ContentLayout title="New Jadwal Laporan">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/jadwal-laporan">Jadwal Laporan</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>New</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <NewJadwalContent />
        </ContentLayout>
    );
}
