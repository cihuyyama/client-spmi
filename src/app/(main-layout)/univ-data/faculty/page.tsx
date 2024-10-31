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
import PlaceholderContent from "@/components/dashboard-content/placeholder-content";
import FacultyContent from "@/components/dashboard-content/univ-data-content/faculty-content/faculty-content";

export default function FacultyDataPage() {
    return (
        <ContentLayout title="Data Unit">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Data Unit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <FacultyContent />
        </ContentLayout>
    )
}