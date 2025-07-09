"use client"
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
import JadwalLaporanContent from "@/components/dashboard-content/jadwal-laporan-content/jadwal-laporan-content";

export default function JadwaLaporanlPage() {

    return (
        <ContentLayout title="Master">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Jadwal Laporan
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <JadwalLaporanContent />
        </ContentLayout>
    );
}
