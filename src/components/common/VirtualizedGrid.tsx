"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import HighPerformanceBookmarkCard from './HighPerformanceBookmarkCard';
import { Skeleton } from "@/components/ui/skeleton";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured: boolean;
}

interface VirtualizedGridProps {
  bookmarks: Bookmark[];
  loading?: boolean;
  className?: string;
  itemHeight?: number;
  overscan?: number;
}

// 计算网格布局
function useGridLayout(containerRef: React.RefObject<HTMLDivElement>) {
  const [layout, setLayout] = useState({
    containerWidth: 1200,
    containerHeight: 600,
    columns: 4,
    itemWidth: 280,
    itemHeight: 140
  });

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = Math.min(window.innerHeight - 200, 800);

      let columns = 1;
      if (containerWidth >= 1536) columns = 6;
      else if (containerWidth >= 1280) columns = 4;
      else if (containerWidth >= 1024) columns = 3;
      else if (containerWidth >= 768) columns = 2;

      const itemWidth = Math.floor((containerWidth - (columns - 1) * 24) / columns);

      setLayout({
        containerWidth,
        containerHeight,
        columns,
        itemWidth: Math.max(itemWidth, 250),
        itemHeight: 140
      });
    };

    updateLayout();
    
    const resizeObserver = new ResizeObserver(updateLayout);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return layout;
}

// 虚拟化逻辑
function useVirtualization(
  items: Bookmark[],
  layout: ReturnType<typeof useGridLayout>,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const { columns, itemHeight, containerHeight } = layout;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * itemHeight;

  // 计算可见范围
  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // 获取可见项目
  const visibleItems = useMemo(() => {
    const visible: Array<{
      bookmark: Bookmark;
      index: number;
      row: number;
      col: number;
      top: number;
      left: number;
    }> = [];

    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          visible.push({
            bookmark: items[index],
            index,
            row,
            col,
            top: row * itemHeight,
            left: col * (layout.itemWidth + 24)
          });
        }
      }
    }

    return visible;
  }, [items, startRow, endRow, columns, itemHeight, layout.itemWidth]);

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    setScrollTop
  };
}

const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
  bookmarks,
  loading = false,
  className,
  overscan = 5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const layout = useGridLayout(containerRef);
  const { visibleItems, totalHeight, setScrollTop } = useVirtualization(
    bookmarks,
    layout,
    overscan
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);

  // 加载状态
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-lg" />
        ))}
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

  // 少量数据使用常规网格
  if (bookmarks.length <= 50) {
    return (
      <div 
        ref={containerRef}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className || ''}`}
      >
        {bookmarks.map((bookmark, index) => (
          <HighPerformanceBookmarkCard
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            url={bookmark.url}
            description={bookmark.description}
            icon={bookmark.icon}
            iconUrl={bookmark.iconUrl}
            isFeatured={bookmark.isFeatured}
            priority={index < 12} // 前12个优先加载
          />
        ))}
      </div>
    );
  }

  // 大量数据使用虚拟化
  return (
    <div ref={containerRef} className={className}>
      <div className="mb-4 text-sm text-gray-500">
        Showing {bookmarks.length} bookmarks (Virtualized)
      </div>
      
      <div
        ref={scrollRef}
        className="overflow-auto border rounded-lg"
        style={{ 
          height: layout.containerHeight,
          width: '100%'
        }}
        onScroll={handleScroll}
      >
        <div 
          style={{ 
            height: totalHeight, 
            position: 'relative',
            width: '100%'
          }}
        >
          {visibleItems.map(({ bookmark, index, top, left }) => (
            <div
              key={bookmark.id}
              style={{
                position: 'absolute',
                top,
                left,
                width: layout.itemWidth,
                height: layout.itemHeight - 12,
                padding: '6px'
              }}
            >
              <HighPerformanceBookmarkCard
                id={bookmark.id}
                title={bookmark.title}
                url={bookmark.url}
                description={bookmark.description}
                icon={bookmark.icon}
                iconUrl={bookmark.iconUrl}
                isFeatured={bookmark.isFeatured}
                priority={index < 20} // 前20个优先加载
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedGrid;