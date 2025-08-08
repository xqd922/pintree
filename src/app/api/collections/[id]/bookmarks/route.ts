import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const includeSubfolders = searchParams.get('includeSubfolders') === 'true';

    // 获取当前文件夹的书签
    const currentBookmarksData = dataService.getBookmarks(id, folderId);
    
    // 如果需要包含子文件夹
    let subfolders: any[] = [];
    if (includeSubfolders) {
      const folders = dataService.getFoldersByCollection(id, folderId);
      
      subfolders = folders.map(folder => {
        // 获取文件夹内的直接书签
        const folderBookmarks = dataService.getBookmarks(id, folder.id);
        
        // 获取子文件夹
        const childFolders = dataService.getFoldersByCollection(id, folder.id);
        
        // 组合项目（文件夹在前，书签在后）
        const items = [
          ...childFolders.map(f => ({
            type: 'folder' as const,
            id: f.id,
            name: f.name,
            icon: f.icon
          })),
          ...folderBookmarks.map(b => ({
            type: 'bookmark' as const,
            id: b.id,
            title: b.title,
            url: b.url,
            description: b.description,
            icon: b.icon,
            isFeatured: b.isFeatured
          }))
        ];

        return {
          id: folder.id,
          name: folder.name,
          icon: folder.icon,
          items: items.slice(0, 50), // 限制显示数量
          totalBookmarks: folderBookmarks.length,
          bookmarkCount: folderBookmarks.length
        };
      });
    }

    return NextResponse.json({
      currentBookmarks: currentBookmarksData,
      subfolders
    });
  } catch (error) {
    console.error('获取书签数据失败:', error);
    return NextResponse.json(
      { error: "Failed to get bookmarks" },
      { status: 500 }
    );
  }
}