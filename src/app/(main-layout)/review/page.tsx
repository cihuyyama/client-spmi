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
import ReviewContent from "@/components/dashboard-content/review-content/review-content";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.unit[0]?.Jadwal[0]?.name != 'review' && userInfo?.role?.permissions.map((p) => p.name).includes('ADMIN_UNIT') && userInfo?.role?.permissions.length == 1) {
      window.location.href = '/dashboard';
      toast.info('Anda tidak memiliki akses ke halaman ini');
    }
  }, [userInfo?.unit, router, userInfo?.role]);

  return (
    <ContentLayout title="Review">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Review Indikator Kinerja
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ReviewContent />
    </ContentLayout>
  );
}
