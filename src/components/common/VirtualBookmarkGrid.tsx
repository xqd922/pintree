"use client";

import React, { useMemo } from 'react';
import LazyBookmarkCard from './LazyBookmarkCard';
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

interface VirtualBookmarkGridProps {
    bookmarks: Bookmark[];
    loading?: boolean;
    className?: string;
}

const VirtualBookmarkGrid: React.FC<VirtualBookmarkGridProps> = ({
    bookmarks,
    loading = false,
    className
}) => {
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

    // 使用响应式网格布局，支持大量书签
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className || ''}`}>
            {bookmarks.map((bookmark) => (
                <LazyBookmarkCard
                    key={bookmark.id}
                    title={bookmark.title}
                    url={bookmark.url}
                    description={bookmark.description}
                    icon={bookmark.icon}
                    iconUrl={bookmark.iconUrl}
                    isFeatured={bookmark.isFeatured}
                />
            ))}
        </div>
    );
};

export default VirtualBookmarkGrid;