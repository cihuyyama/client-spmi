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
import UserDetailContent from "@/components/dashboard-content/users-content/detail-user/detail-user-content";

export default function UserDetailPage({ params }: { params: { id: string } }) {

    return (
        <ContentLayout title="Users">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild >
                            <Link href="/users">Users</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Detail
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UserDetailContent id={params.id} />
        </ContentLayout>
    );
}
