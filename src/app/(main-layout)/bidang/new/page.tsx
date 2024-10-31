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
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import NewBidangContent from "@/components/dashboard-content/bidang-content/new-bidang/new-bidang-content";

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const { userInfo } = useSelector((state: RootState) => state.auth);

    return (
        <ContentLayout title="Data">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild >
                            <Link href="/bidang">Bidang Unit</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            New Bidang
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <NewBidangContent />
        </ContentLayout>
    );
}
