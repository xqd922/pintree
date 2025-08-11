// 性能配置
export const PERFORMANCE_CONFIG = {
  // 数据加载配置
  DATA_LOADING: {
    CACHE_TTL: 5 * 60 * 1000, // 5分钟缓存
    MAX_BOOKMARKS_PER_PAGE: 50,
    MAX_SUBFOLDERS_PREVIEW: 20,
    ENABLE_INDEXING: true,
    ENABLE_COMPRESSION: false // base64 图标不压缩
  },

  // 前端渲染配置
  RENDERING: {
    VIRTUAL_SCROLL_THRESHOLD: 100, // 超过100个书签启用虚拟滚动
    LAZY_LOADING: true,
    IMAGE_LOADING: 'lazy' as const,
    DEBOUNCE_SEARCH: 300, // 搜索防抖延迟
    SKELETON_COUNT: 24
  },

  // API 配置
  API: {
    CACHE_HEADERS: {
      COLLECTIONS: 'public, s-maxage=60, stale-while-revalidate=300',
      BOOKMARKS: 'public, s-maxage=30, stale-while-revalidate=60',
      SEARCH: 'public, s-maxage=10, stale-while-revalidate=30',
      SETTINGS: 'public, s-maxage=300, stale-while-revalidate=600'
    },
    REQUEST_TIMEOUT: 10000, // 10秒超时
    RETRY_ATTEMPTS: 2
  },

  // 图标优化配置
  ICONS: {
    MAX_SIZE_WARNING: 50000, // 50KB 以上的图标显示警告
    PRELOAD_COMMON_ICONS: true,
    FALLBACK_ICON: '🔗',
    LAZY_LOAD_ICONS: true
  },

  // 内存管理配置
  MEMORY: {
    MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB 最大缓存
    CLEANUP_INTERVAL: 10 * 60 * 1000, // 10分钟清理一次
    LOG_MEMORY_USAGE: process.env.NODE_ENV === 'development'
  }
};

// 获取当前环境的性能配置
export function getPerformanceConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    ...PERFORMANCE_CONFIG,
    // 开发环境启用更多调试功能
    DEBUG: isDevelopment,
    // 生产环境优化配置
    OPTIMIZED: isProduction,
    // 根据环境调整缓存策略
    DATA_LOADING: {
      ...PERFORMANCE_CONFIG.DATA_LOADING,
      CACHE_TTL: isDevelopment ? 30 * 1000 : PERFORMANCE_CONFIG.DATA_LOADING.CACHE_TTL
    }
  };
}

// 性能监控阈值
export const PERFORMANCE_THRESHOLDS = {
  DATA_LOAD_TIME: 1000, // 数据加载超过1秒警告
  RENDER_TIME: 500, // 渲染超过500ms警告
  SEARCH_TIME: 200, // 搜索超过200ms警告
  API_RESPONSE_TIME: 2000, // API响应超过2秒警告
  MEMORY_USAGE: 200 * 1024 * 1024 // 内存使用超过200MB警告
};

// 检查性能指标
export function checkPerformanceThreshold(metric: keyof typeof PERFORMANCE_THRESHOLDS, value: number): boolean {
  const threshold = PERFORMANCE_THRESHOLDS[metric];
  const exceeded = value > threshold;
  
  if (exceeded && PERFORMANCE_CONFIG.MEMORY.LOG_MEMORY_USAGE) {
    console.warn(`⚠️ Performance threshold exceeded for ${metric}: ${value}ms > ${threshold}ms`);
  }
  
  return exceeded;
}