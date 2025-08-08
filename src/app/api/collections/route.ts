import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('publicOnly') === 'true';
    
    // 获取集合列表
    const collections = dataService.getCollections(publicOnly);

    // 添加书签数量统计
    const collectionsWithBookmarkCount = collections.map(collection => ({
      ...collection,
      totalBookmarks: dataService.getBookmarkCount(collection.id)
    }));

    return NextResponse.json(collectionsWithBookmarkCount);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get bookmark collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 注意：JSON 文件模式下，创建集合需要手动编辑 JSON 文件
    // 这里返回一个提示信息
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来添加新集合",
        message: "In JSON file mode, please edit data/bookmarks.json directly to add new collections"
      },
      { status: 501 }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}
