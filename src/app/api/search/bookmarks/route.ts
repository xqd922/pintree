import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const scope = searchParams.get('scope') || 'all';
    const collectionId = searchParams.get('collectionId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!query.trim()) {
      return NextResponse.json({
        bookmarks: [],
        total: 0,
        page,
        pageSize
      });
    }

    // 执行搜索
    let searchResults = dataService.searchBookmarks(
      query,
      scope === 'current' ? collectionId || undefined : undefined
    );

    // 分页处理
    const total = searchResults.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    return NextResponse.json({
      bookmarks: paginatedResults,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}