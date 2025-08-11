import { dataService } from "@/lib/data";
import { dataOptimizer } from "@/lib/data-optimizer";
import { NextResponse } from "next/server";

// 启用边缘运行时以提高性能
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20'); // 减少默认限制
    const includeSubfolders = searchParams.get('includeSubfolders') === 'true';
    
    const offset = (page - 1) * limit;
    const collectionId = params.id;

    // 并行获取数据
    const [currentBookmarks, totalBookmarks, subfolders, breadcrumbs] = await Promise.all([
      // 获取当前页书签
      Promise.resolve(dataService.getBookmarks(collectionId, folderId || null, limit, offset)),
      
      // 获取总数
      Promise.resolve(dataService.getBookmarksCount(collectionId, folderId || null)),
      
      // 获取子文件夹（仅第一页且需要时）
      includeSubfolders && page === 1 
        ? Promise.resolve(getOptimizedSubfolders(collectionId, folderId || null))
        : Promise.resolve([]),
      
      // 获取面包屑
      folderId 
        ? Promise.resolve(dataService.getFolderPath(folderId))
        : Promise.resolve([])
    ]);

    // 预处理书签数据
    const optimizedBookmarks = dataOptimizer.preprocessBookmarks(currentBookmarks);

    const response = {
      currentBookmarks: optimizedBookmarks,
      subfolders,
      breadcrumbs,
      pagination: {
        page,
        limit,
        total: totalBookmarks,
        totalPages: Math.ceil(totalBookmarks / limit),
        hasNext: offset + limit < totalBookmarks,
        hasPrev: page > 1
      },
      performance: {
        processingTime: Date.now() - startTime,
        cacheStats: dataOptimizer.getCacheStats()
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Processing-Time': `${Date.now() - startTime}ms`,
        // 启用压缩
        'Content-Encoding': 'gzip',
        // 预加载提示
        'Link': generatePreloadLinks(optimizedBookmarks)
      }
    });

  } catch (error) {
    console.error('获取书签数据失败:', error);
    return NextResponse.json(
      { 
        error: "Failed to get bookmarks",
        performance: {
          processingTime: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}

// 优化子文件夹获取
async function getOptimizedSubfolders(collectionId: string, folderId: string | null) {
  const folders = dataService.getFoldersByCollection(collectionId, folderId);
  
  return folders.map(folder => {
    // 限制每个子文件夹的预览数量
    const folderBookmarks = dataService.getBookmarks(collectionId, folder.id, 10); // 只取10个
    const totalFolderBookmarks = dataService.getBookmarksCount(collectionId, folder.id);
    
    return {
      id: folder.id,
      name: folder.name,
      icon: folder.icon,
      items: [
        // 子文件夹
        ...dataService.getFoldersByCollection(collectionId, folder.id)
          .slice(0, 5) // 最多5个子文件夹
          .map(f => ({
            type: 'folder' as const,
            id: f.id,
            name: f.name,
            icon: f.icon
          })),
        // 书签预览
        ...dataOptimizer.preprocessBookmarks(folderBookmarks).map(b => ({
          type: 'bookmark' as const,
          id: b.id,
          title: b.title,
          url: b.url,
          description: b.description,
          icon: b.icon,
          iconUrl: b.iconUrl,
          isFeatured: b.isFeatured,
          hostname: b.hostname
        }))
      ],
      totalBookmarks: totalFolderBookmarks,
      bookmarkCount: totalFolderBookmarks
    };
  });
}

// 生成预加载链接
function generatePreloadLinks(bookmarks: any[]): string {
  const links: string[] = [];
  
  // 预加载前几个图标
  bookmarks.slice(0, 5).forEach(bookmark => {
    if (bookmark.iconUrl && !bookmark.iconUrl.startsWith('data:')) {
      links.push(`<${bookmark.iconUrl}>; rel=preload; as=image`);
    }
  });
  
  return links.join(', ');
}