"use client";

import React, { useMemo, useState, useCallback } from 'react';
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

interface OptimizedBookmarkGridProps {
  bookmarks: Bookmark[];
  loading?: boolean;
  className?: string;
  pageSize?: number;
}

const OptimizedBookmarkGrid: React.FC<OptimizedBookmarkGridProps> = ({
  bookmarks,
  loading = false,
  className,
  pageSize = 50
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // 分页显示的书签
  const visibleBookmarks = useMemo(() => {
    return bookmarks.slice(0, visibleCount);
  }, [bookmarks, visibleCount]);

  // 是否还有更多书签
  const hasMore = bookmarks.length > visibleCount;

  // 加载更多
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + pageSize, bookmarks.length));
  }, [pageSize, bookmarks.length]);

  // 加载状态的骨架屏
  const LoadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: 24 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] rounded-lg" />
      ))}
    </div>
  ), []);

  if (loading) {
    return LoadingSkeleton;
  }

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

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore}
            variant="outline"
            size="lg"
          >
            Load More ({bookmarks.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {/* 显示统计信息 */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {visibleCount} of {bookmarks.length} bookmarks
      </div>
    </div>
  );
};

export default OptimizedBookmarkGrid;