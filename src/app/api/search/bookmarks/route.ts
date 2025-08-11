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

    // 计算分页参数
    const offset = (page - 1) * pageSize;
    
    // 执行搜索（直接使用分页）
    const { bookmarks: paginatedResults, total } = dataService.searchBookmarks(
      query,
      scope === 'current' ? collectionId || undefined : undefined,
      pageSize,
      offset
    );

    return NextResponse.json({
      bookmarks: paginatedResults,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}