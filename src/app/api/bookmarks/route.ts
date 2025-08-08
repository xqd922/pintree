import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "100");
    
    // 获取所有书签
    const allBookmarks = dataService.getAllBookmarks();
    const collections = dataService.getCollections();
    const folders = dataService.getAllFolders();
    
    // 添加集合和文件夹信息
    const bookmarksWithInfo = allBookmarks.map(bookmark => {
      const collection = collections.find(c => c.id === bookmark.collectionId);
      const folder = bookmark.folderId ? folders.find(f => f.id === bookmark.folderId) : null;
      
      return {
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        icon: bookmark.icon,
        isFeatured: bookmark.isFeatured,
        createdAt: new Date().toISOString(), // JSON 模式下没有创建时间，使用当前时间
        collection: collection ? { name: collection.name } : null,
        folder: folder ? { name: folder.name } : null,
      };
    });

    // 分页处理
    const total = bookmarksWithInfo.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBookmarks = bookmarksWithInfo.slice(startIndex, endIndex);

    return NextResponse.json({
      bookmarks: paginatedBookmarks,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize)
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JSON 文件模式下，创建书签需要手动编辑 JSON 文件
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来添加新书签",
        message: "In JSON file mode, please edit data/bookmarks.json directly to add new bookmarks"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Failed to create bookmark:", error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}
