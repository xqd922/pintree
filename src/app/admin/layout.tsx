import { requireAuth } from "@/lib/auth/utils";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { isLocalEnvironment } from "@/lib/env";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 检查是否为本地环境
  if (!isLocalEnvironment()) {
    redirect('/');
  }

  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <SidebarProvider>
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
