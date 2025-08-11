import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const includeSubfolders = searchParams.get('includeSubfolders') === 'true';
    
    const offset = (page - 1) * limit;
    const collectionId = params.id;

    // 获取当前文件夹的书签（分页）
    const currentBookmarks = dataService.getBookmarks(
      collectionId, 
      folderId || null, 
      limit, 
      offset
    );
    
    const totalBookmarks = dataService.getBookmarksCount(collectionId, folderId || null);

    let subfolders: any[] = [];
    
    if (includeSubfolders && page === 1) { // 只在第一页加载子文件夹
      const folders = dataService.getFoldersByCollection(collectionId, folderId || null);
      
      subfolders = folders.map(folder => {
        // 限制每个子文件夹显示的书签数量
        const folderBookmarks = dataService.getBookmarks(collectionId, folder.id, 20); // 最多20个
        const totalFolderBookmarks = dataService.getBookmarksCount(collectionId, folder.id);
        
        return {
          id: folder.id,
          name: folder.name,
          icon: folder.icon,
          items: [
            ...dataService.getFoldersByCollection(collectionId, folder.id).map(f => ({
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
          ],
          totalBookmarks: totalFolderBookmarks,
          bookmarkCount: totalFolderBookmarks
        };
      });
    }

    // 获取面包屑导航
    let breadcrumbs: any[] = [];
    if (folderId) {
      breadcrumbs = dataService.getFolderPath(folderId);
    }

    return NextResponse.json({
      currentBookmarks,
      subfolders,
      breadcrumbs,
      pagination: {
        page,
        limit,
        total: totalBookmarks,
        totalPages: Math.ceil(totalBookmarks / limit),
        hasNext: offset + limit < totalBookmarks,
        hasPrev: page > 1
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('获取书签数据失败:', error);
    return NextResponse.json(
      { error: "Failed to get bookmarks" },
      { status: 500 }
    );
  }
}