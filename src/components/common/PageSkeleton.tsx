"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider } from "@/components/ui/sidebar";

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <SidebarProvider>
          {/* 侧边栏骨架屏 */}
          <div className="flex flex-col h-screen bg-[#F9F9F9] w-64 border-r">
            {/* Logo 区域 */}
            <div className="flex-shrink-0 p-4">
              <Skeleton className="h-[60px] w-full" />
            </div>
            
            {/* 文件夹列表骨架屏 */}
            <div className="flex-1 p-4 space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* 主内容区域骨架屏 */}
          <div className="flex flex-1 flex-col">
            {/* Header 骨架屏 */}
            <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-4 w-px" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* 搜索栏骨架屏 */}
            <div className="flex justify-center mt-4 mb-12 px-6">
              <Skeleton className="h-12 w-96 rounded-full" />
            </div>

            {/* 内容网格骨架屏 */}
            <div className="flex-1 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-[90px] rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}