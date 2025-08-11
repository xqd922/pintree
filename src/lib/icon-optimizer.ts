// 图标优化工具 - 在保留 base64 的前提下优化性能

export interface IconCache {
  [key: string]: string;
}

class IconOptimizer {
  private iconCache: IconCache = {};
  private compressionCache: Map<string, string> = new Map();

  // 检查 base64 图标是否可以压缩
  canOptimizeIcon(iconData: string): boolean {
    if (!iconData || !iconData.startsWith('data:image/')) {
      return false;
    }
    
    // 检查是否已经是压缩格式
    return iconData.includes('data:image/png') || iconData.includes('data:image/jpeg');
  }

  // 获取图标的压缩版本（如果可能）
  getOptimizedIcon(iconData: string): string {
    if (!iconData) return iconData;
    
    // 检查缓存
    if (this.compressionCache.has(iconData)) {
      return this.compressionCache.get(iconData)!;
    }

    // 对于非常大的 base64 图标，可以考虑降质量
    if (iconData.length > 10000) { // 大于 10KB 的图标
      console.warn('Large icon detected:', iconData.length, 'bytes');
      // 这里可以实现图标压缩逻辑
      // 目前直接返回原图标
    }

    this.compressionCache.set(iconData, iconData);
    return iconData;
  }

  // 预加载常用图标
  preloadIcons(bookmarks: any[]) {
    const iconUrls = new Set<string>();
    
    bookmarks.forEach(bookmark => {
      if (bookmark.iconUrl && !bookmark.iconUrl.startsWith('data:')) {
        iconUrls.add(bookmark.iconUrl);
      }
    });

    // 在浏览器环境中预加载图标
    if (typeof window !== 'undefined') {
      iconUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }
  }

  // 批量处理图标
  processBookmarkIcons(bookmarks: any[]): any[] {
    return bookmarks.map(bookmark => ({
      ...bookmark,
      icon: this.getOptimizedIcon(bookmark.icon),
      // 如果有 iconUrl 且不是 base64，优先使用 iconUrl
      displayIcon: bookmark.iconUrl && !bookmark.iconUrl.startsWith('data:') 
        ? bookmark.iconUrl 
        : this.getOptimizedIcon(bookmark.icon)
    }));
  }

  // 清理缓存
  clearCache() {
    this.iconCache = {};
    this.compressionCache.clear();
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      iconCacheSize: Object.keys(this.iconCache).length,
      compressionCacheSize: this.compressionCache.size,
      memoryUsage: JSON.stringify(this.iconCache).length + 
                   Array.from(this.compressionCache.values()).join('').length
    };
  }
}

// 创建全局实例
export const iconOptimizer = new IconOptimizer();

// 图标懒加载组件辅助函数
export function createLazyIcon(iconData: string, fallbackIcon: string = '🔗') {
  return {
    src: iconData,
    fallback: fallbackIcon,
    loading: false,
    error: false
  };
}

// 检查图标是否为有效的 base64
export function isValidBase64Icon(iconData: string): boolean {
  if (!iconData || typeof iconData !== 'string') {
    return false;
  }
  
  try {
    // 检查是否是有效的 data URL
    if (!iconData.startsWith('data:image/')) {
      return false;
    }
    
    // 简单验证 base64 格式
    const base64Part = iconData.split(',')[1];
    if (!base64Part) {
      return false;
    }
    
    // 检查 base64 字符串是否有效
    return /^[A-Za-z0-9+/]*={0,2}$/.test(base64Part);
  } catch {
    return false;
  }
}

// 获取图标大小（字节）
export function getIconSize(iconData: string): number {
  if (!iconData) return 0;
  
  try {
    // 对于 base64，计算实际字节大小
    if (iconData.startsWith('data:')) {
      const base64Part = iconData.split(',')[1];
      if (base64Part) {
        // base64 编码后的大小约为原始大小的 4/3
        return Math.floor((base64Part.length * 3) / 4);
      }
    }
    
    return iconData.length;
  } catch {
    return 0;
  }
}