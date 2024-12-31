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
import CategoryUnitContent from "@/components/dashboard-content/unit-content/category-content/category-unit-content";

export default function CategoryUnitDataPage() {
    return (
        <ContentLayout title="Admin Perencanaan">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Data Category Unit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CategoryUnitContent/>
        </ContentLayout>
    )
}