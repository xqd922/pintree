// 数据优化器 - 专门处理大量书签数据的性能优化

interface BookmarkData {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured: boolean;
  collectionId: string;
  folderId?: string | null;
  tags: string[];
  sortOrder: number;
}

interface OptimizedBookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  isFeatured: boolean;
  hostname: string;
  hasLargeIcon: boolean;
}

class DataOptimizer {
  private processedCache = new Map<string, OptimizedBookmark[]>();
  private hostnameCache = new Map<string, string>();
  
  // 预处理书签数据
  preprocessBookmarks(bookmarks: BookmarkData[]): OptimizedBookmark[] {
    const cacheKey = this.generateCacheKey(bookmarks);
    
    if (this.processedCache.has(cacheKey)) {
      return this.processedCache.get(cacheKey)!;
    }

    const processed = bookmarks.map(bookmark => this.processBookmark(bookmark));
    
    // 缓存结果，但限制缓存大小
    if (this.processedCache.size > 10) {
      const firstKey = this.processedCache.keys().next().value;
      if (firstKey) {
        this.processedCache.delete(firstKey);
      }
    }
    
    this.processedCache.set(cacheKey, processed);
    return processed;
  }

  private processBookmark(bookmark: BookmarkData): OptimizedBookmark {
    return {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      icon: this.optimizeIcon(bookmark.icon),
      iconUrl: bookmark.iconUrl,
      isFeatured: bookmark.isFeatured,
      hostname: this.getHostname(bookmark.url),
      hasLargeIcon: this.isLargeIcon(bookmark.icon)
    };
  }

  private getHostname(url: string): string {
    if (this.hostnameCache.has(url)) {
      return this.hostnameCache.get(url)!;
    }

    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = url;
    }

    // 限制缓存大小
    if (this.hostnameCache.size > 1000) {
      const firstKey = this.hostnameCache.keys().next().value;
      if (firstKey) {
        this.hostnameCache.delete(firstKey);
      }
    }

    this.hostnameCache.set(url, hostname);
    return hostname;
  }

  private optimizeIcon(icon?: string): string | undefined {
    if (!icon || !icon.startsWith('data:image/')) {
      return icon;
    }

    // 对于超大图标，可以考虑压缩或替换
    if (icon.length > 50000) { // 50KB
      console.warn('Very large icon detected:', icon.length, 'bytes');
      // 这里可以实现图标压缩逻辑
      // 目前返回原图标
    }

    return icon;
  }

  private isLargeIcon(icon?: string): boolean {
    return !!(icon && icon.length > 10000); // 10KB
  }

  private generateCacheKey(bookmarks: BookmarkData[]): string {
    // 使用书签数量和前几个ID生成简单的缓存键
    const ids = bookmarks.slice(0, 5).map(b => b.id).join(',');
    return `${bookmarks.length}-${ids}`;
  }

  // 分批处理大量数据
  async processBatches<T>(
    items: T[],
    batchSize: number = 100,
    processor: (batch: T[]) => Promise<any[]>
  ): Promise<any[]> {
    const results: any[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
      
      // 让出控制权，避免阻塞UI
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  }

  // 清理缓存
  clearCache() {
    this.processedCache.clear();
    this.hostnameCache.clear();
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      processedCacheSize: this.processedCache.size,
      hostnameCacheSize: this.hostnameCache.size,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    let size = 0;
    
    // 估算处理缓存大小
    this.processedCache.forEach(bookmarks => {
      size += JSON.stringify(bookmarks).length;
    });
    
    // 估算域名缓存大小
    this.hostnameCache.forEach((hostname, url) => {
      size += url.length + hostname.length;
    });
    
    return size;
  }
}

// 创建全局实例
export const dataOptimizer = new DataOptimizer();

// 工具函数
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}