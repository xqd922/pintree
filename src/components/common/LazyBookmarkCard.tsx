"use client";

import React, { useState, useCallback, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidBase64Icon, getIconSize } from "@/lib/icon-optimizer";

interface LazyBookmarkCardProps {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured?: boolean;
  className?: string;
}

const LazyBookmarkCard = memo(function LazyBookmarkCard({
  title,
  url,
  description,
  icon,
  iconUrl,
  isFeatured = false,
  className
}: LazyBookmarkCardProps) {
  const [iconError, setIconError] = useState(false);
  const [iconLoading, setIconLoading] = useState(true);

  // 选择最佳图标源
  const getIconSrc = useCallback(() => {
    // 优先使用外部 URL（如果可用且在大陆可访问）
    if (iconUrl && !iconUrl.startsWith('data:')) {
      return iconUrl;
    }
    
    // 使用 base64 图标
    if (icon && isValidBase64Icon(icon)) {
      return icon;
    }
    
    // 回退到默认图标
    return null;
  }, [icon, iconUrl]);

  const handleIconLoad = useCallback(() => {
    setIconLoading(false);
  }, []);

  const handleIconError = useCallback(() => {
    setIconError(true);
    setIconLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  const iconSrc = getIconSrc();
  const showDefaultIcon = !iconSrc || iconError;

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        "border-gray-200 hover:border-gray-300",
        isFeatured && "ring-2 ring-blue-200",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* 图标区域 */}
          <div className="flex-shrink-0 w-8 h-8 relative">
            {showDefaultIcon ? (
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                🔗
              </div>
            ) : (
              <>
                {iconLoading && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                )}
                <img
                  src={iconSrc}
                  alt=""
                  className={cn(
                    "w-8 h-8 rounded-lg object-cover",
                    iconLoading && "opacity-0"
                  )}
                  onLoad={handleIconLoad}
                  onError={handleIconError}
                  loading="lazy"
                />
              </>
            )}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            
            {description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {description}
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-1 truncate">
              {(() => {
                try {
                  return new URL(url).hostname;
                } catch {
                  return url;
                }
              })()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default LazyBookmarkCard;