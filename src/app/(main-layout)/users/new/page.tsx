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
import UsersContent from "@/components/dashboard-content/users-content/users-content";
import UserDetailContent from "@/components/dashboard-content/users-content/detail-user/detail-user-content";
import NewUserContent from "@/components/dashboard-content/users-content/new-user/new-user-content";

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const { userInfo } = useSelector((state: RootState) => state.auth);

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
                            New
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <NewUserContent />
        </ContentLayout>
    );
}
