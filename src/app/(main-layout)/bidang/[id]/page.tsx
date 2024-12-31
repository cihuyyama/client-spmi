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
import DetailBidangContent from "@/components/dashboard-content/bidang-content/detail-bidang/detail-bidang-content";

export default function BidangDetailPage({ params }: { params: { id: string } }) {

    return (
        <ContentLayout title="Data">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild >
                            <Link href="/bidang">Bidang</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Detail Bidang
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <DetailBidangContent id={params.id} />
        </ContentLayout>
    );
}
