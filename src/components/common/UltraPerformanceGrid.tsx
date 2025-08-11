"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import HighPerformanceBookmarkCard from './HighPerformanceBookmarkCard';
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
    collectionId?: string;
    tags?: string[];
    sortOrder?: number;
}

interface UltraPerformanceGridProps {
    bookmarks: Bookmark[];
    loading?: boolean;
    className?: string;
    pageSize?: number;
    enableVirtualization?: boolean;
}

const UltraPerformanceGrid: React.FC<UltraPerformanceGridProps> = ({
    bookmarks,
    loading = false,
    className,
    pageSize = 20,
    enableVirtualization = true
}) => {
    const [processedBookmarks, setProcessedBookmarks] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(pageSize);
    const [processing, setProcessing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 获取域名的辅助函数
    const getHostname = useCallback((url: string): string => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }, []);

    // 处理书签数据
    useEffect(() => {
        if (bookmarks.length === 0) {
            setProcessedBookmarks([]);
            return;
        }

        const processData = async () => {
            setProcessing(true);

            try {
                let processed: any[];

                // 直接处理书签数据
                processed = bookmarks.map(bookmark => ({
                    ...bookmark,
                    hostname: getHostname(bookmark.url),
                    hasLargeIcon: bookmark.icon && bookmark.icon.length > 10000,
                    searchText: `${bookmark.title} ${bookmark.description || ''} ${bookmark.url}`.toLowerCase()
                }));

                setProcessedBookmarks(processed);
            } catch (error) {
                console.error('Failed to process bookmarks:', error);
                // 回退到原始数据
                setProcessedBookmarks(bookmarks);
            } finally {
                setProcessing(false);
            }
        };

        processData();
    }, [bookmarks, getHostname]);

    // 设置无限滚动
    useEffect(() => {
        if (!enableVirtualization || !loadMoreRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < processedBookmarks.length) {
                    setVisibleCount(prev => Math.min(prev + pageSize, processedBookmarks.length));
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [visibleCount, processedBookmarks.length, pageSize, enableVirtualization]);

    // 可见的书签
    const visibleBookmarks = useMemo(() => {
        return processedBookmarks.slice(0, visibleCount);
    }, [processedBookmarks, visibleCount]);

    // 手动加载更多
    const loadMore = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + pageSize, processedBookmarks.length));
    }, [pageSize, processedBookmarks.length]);

    // 加载状态
    if (loading || processing) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {Array.from({ length: Math.min(pageSize, 24) }).map((_, i) => (
                        <Skeleton key={i} className="h-[140px] rounded-lg" />
                    ))}
                </div>
                {processing && (
                    <div className="text-center text-sm text-gray-500">
                        Processing {bookmarks.length} bookmarks...
                    </div>
                )}
            </div>
        );
    }

    // 空状态
    if (processedBookmarks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <p>No bookmarks found</p>
                </div>
            </div>
        );
    }

    const hasMore = visibleCount < processedBookmarks.length;

    return (
        <div ref={containerRef} className={className}>
            {/* 性能统计 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    Total: {processedBookmarks.length} | Visible: {visibleCount} |
                    Virtual: {enableVirtualization ? 'ON' : 'OFF'}
                </div>
            )}

            {/* 书签网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {visibleBookmarks.map((bookmark, index) => (
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

            {/* 加载更多区域 */}
            {hasMore && (
                <div className="mt-8 space-y-4">
                    {/* 无限滚动触发器 */}
                    {enableVirtualization && (
                        <div ref={loadMoreRef} className="h-4" />
                    )}

                    {/* 手动加载按钮 */}
                    <div className="flex justify-center">
                        <Button
                            onClick={loadMore}
                            variant="outline"
                            size="lg"
                            disabled={processing}
                        >
                            {processing ? 'Loading...' : `Load More (${processedBookmarks.length - visibleCount} remaining)`}
                        </Button>
                    </div>
                </div>
            )}

            {/* 统计信息 */}
            <div className="text-center text-sm text-gray-500 mt-4">
                Showing {visibleCount} of {processedBookmarks.length} bookmarks
            </div>
        </div>
    );
};

export default UltraPerformanceGrid;