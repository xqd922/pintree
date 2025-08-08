import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const allBookmarks = dataService.getAllBookmarks();
    const bookmark = allBookmarks.find(b => b.id === id);

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // 添加集合和文件夹信息
    const collection = dataService.getCollectionById(bookmark.collectionId);
    const folder = bookmark.folderId ? dataService.getFolderById(bookmark.folderId) : null;

    const bookmarkWithInfo = {
      ...bookmark,
      collection: collection ? { name: collection.name } : null,
      folder: folder ? { name: folder.name } : null,
      tags: bookmark.tags || []
    };

    return NextResponse.json(bookmarkWithInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get bookmark" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JSON 文件模式下，删除书签需要手动编辑 JSON 文件
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来删除书签",
        message: "In JSON file mode, please edit data/bookmarks.json directly to delete bookmarks"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete bookmark failed" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JSON 文件模式下，更新书签需要手动编辑 JSON 文件
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来更新书签",
        message: "In JSON file mode, please edit data/bookmarks.json directly to update bookmarks"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update bookmark failed" }, { status: 500 });
  }
}

