"use client";

import React, { memo, useCallback, useMemo } from 'react';
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import OptimizedIcon from './OptimizedIcon';

interface HighPerformanceBookmarkCardProps {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured?: boolean;
  className?: string;
  priority?: boolean;
}

const HighPerformanceBookmarkCard = memo(function HighPerformanceBookmarkCard({
  id,
  title,
  url,
  description,
  icon,
  iconUrl,
  isFeatured = false,
  className,
  priority = false
}: HighPerformanceBookmarkCardProps) {
  
  // 预计算域名，避免重复计算
  const hostname = useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, [url]);

  // 选择最佳图标源
  const iconSrc = useMemo(() => {
    // 优先使用外部 URL（如果不是 base64）
    if (iconUrl && !iconUrl.startsWith('data:')) {
      return iconUrl;
    }
    // 使用 base64 图标
    if (icon && icon.startsWith('data:image/')) {
      return icon;
    }
    return null;
  }, [icon, iconUrl]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // 使用更高效的方式打开链接
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }, [url]);

  return (
    <article 
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg overflow-hidden",
        "cursor-pointer transition-all duration-200 will-change-transform",
        "hover:shadow-md hover:border-gray-300 hover:scale-[1.02]",
        isFeatured && "ring-2 ring-blue-200",
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* 图标区域 */}
          <div className="flex-shrink-0">
            <OptimizedIcon
              src={iconSrc || undefined}
              alt={`${title} icon`}
              size={32}
              priority={priority}
              fallback="🔗"
            />
          </div>

          {/* 内容区域 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <ExternalLink 
                className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" 
                aria-hidden="true"
              />
            </div>
            
            {description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {description}
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-1 truncate">
              {hostname}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
});

export default HighPerformanceBookmarkCard;