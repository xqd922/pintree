"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { BookmarkCard } from "@/components/bookmark/BookmarkCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured: boolean;
}

interface SimpleOptimizedGridProps {
  bookmarks: Bookmark[];
  loading?: boolean;
  className?: string;
  pageSize?: number;
}

const SimpleOptimizedGrid: React.FC<SimpleOptimizedGridProps> = ({
  bookmarks,
  loading = false,
  className,
  pageSize = 24
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 可见的书签
  const visibleBookmarks = useMemo(() => {
    return bookmarks.slice(0, visibleCount);
  }, [bookmarks, visibleCount]);

  // 是否还有更多
  const hasMore = bookmarks.length > visibleCount;

  // 设置无限滚动
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + pageSize, bookmarks.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, pageSize, bookmarks.length]);

  // 手动加载更多
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + pageSize, bookmarks.length));
  }, [pageSize, bookmarks.length]);

  // 重置可见数量当书签变化时
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [bookmarks, pageSize]);

  // 加载状态
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: Math.min(pageSize, 24) }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // 空状态
  if (bookmarks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p>No bookmarks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 性能统计 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 text-xs text-gray-400 bg-gray-50 p-2 rounded">
          Total: {bookmarks.length} | Visible: {visibleCount} | Optimized Grid
        </div>
      )}

      {/* 书签网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {visibleBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            title={bookmark.title}
            url={bookmark.url}
            description={bookmark.description}
            icon={bookmark.icon}
            isFeatured={bookmark.isFeatured}
          />
        ))}
      </div>

      {/* 加载更多区域 */}
      {hasMore && (
        <div className="mt-8 space-y-4">
          {/* 无限滚动触发器 */}
          <div ref={loadMoreRef} className="h-4" />
          
          {/* 手动加载按钮 */}
          <div className="flex justify-center">
            <Button 
              onClick={loadMore}
              variant="outline"
              size="lg"
            >
              Load More ({bookmarks.length - visibleCount} remaining)
            </Button>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {visibleCount} of {bookmarks.length} bookmarks
      </div>
    </div>
  );
};

export default SimpleOptimizedGrid;