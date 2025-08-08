import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; folderId: string }> }
) {
  try {
    const { folderId } = await params;
    
    // 获取文件夹路径（面包屑导航）
    const path = dataService.getFolderPath(folderId);
    
    // 转换为前端需要的格式
    const breadcrumbs = path.map(folder => ({
      id: folder.id,
      name: folder.name
    }));

    return NextResponse.json(breadcrumbs);
  } catch (error) {
    console.error('获取文件夹路径失败:', error);
    return NextResponse.json(
      { error: "Failed to get folder path" },
      { status: 500 }
    );
  }
}
