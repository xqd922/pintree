// Web Worker 管理器
class WorkerManager {
  private worker: Worker | null = null;
  private taskQueue: Array<{
    id: string;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    if (typeof window !== 'undefined' && window.Worker) {
      this.initWorker();
    }
  }

  private initWorker() {
    try {
      this.worker = new Worker('/workers/data-processor.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
    } catch (error) {
      console.warn('Failed to initialize Web Worker:', error);
    }
  }

  private handleWorkerMessage(e: MessageEvent) {
    const { type, data, error } = e.data;
    
    // 找到对应的任务
    const taskIndex = this.taskQueue.findIndex(task => 
      type.includes(task.id.toUpperCase())
    );
    
    if (taskIndex === -1) return;
    
    const task = this.taskQueue[taskIndex];
    this.taskQueue.splice(taskIndex, 1);
    
    if (error) {
      task.reject(new Error(error));
    } else {
      task.resolve(data);
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Web Worker error:', error);
    // 拒绝所有待处理的任务
    this.taskQueue.forEach(task => {
      task.reject(new Error('Worker error'));
    });
    this.taskQueue = [];
  }

  private postTask<T>(type: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        // 如果没有 Worker，回退到主线程处理
        resolve(this.fallbackProcess(type, data));
        return;
      }

      const taskId = Math.random().toString(36).substr(2, 9);
      this.taskQueue.push({ id: taskId, resolve, reject });
      
      this.worker.postMessage({ type, data, taskId });
      
      // 设置超时
      setTimeout(() => {
        const taskIndex = this.taskQueue.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          this.taskQueue.splice(taskIndex, 1);
          reject(new Error('Task timeout'));
        }
      }, 10000); // 10秒超时
    });
  }

  // 处理书签数据
  async processBookmarks(bookmarks: any[]): Promise<any[]> {
    try {
      return await this.postTask('PROCESS_BOOKMARKS', bookmarks);
    } catch (error) {
      console.warn('Worker processing failed, using fallback:', error);
      return this.fallbackProcess('PROCESS_BOOKMARKS', bookmarks);
    }
  }

  // 优化图标
  async optimizeIcons(bookmarks: any[]): Promise<any[]> {
    try {
      return await this.postTask('OPTIMIZE_ICONS', bookmarks);
    } catch (error) {
      console.warn('Worker icon optimization failed, using fallback:', error);
      return this.fallbackProcess('OPTIMIZE_ICONS', bookmarks);
    }
  }

  // 搜索书签
  async searchBookmarks(bookmarks: any[], query: string, options?: any): Promise<any> {
    try {
      return await this.postTask('SEARCH_BOOKMARKS', { bookmarks, query, options });
    } catch (error) {
      console.warn('Worker search failed, using fallback:', error);
      return this.fallbackProcess('SEARCH_BOOKMARKS', { bookmarks, query, options });
    }
  }

  // 回退处理（主线程）
  private fallbackProcess(type: string, data: any): any {
    switch (type) {
      case 'PROCESS_BOOKMARKS':
        return data.map((bookmark: any) => ({
          ...bookmark,
          hostname: this.getHostname(bookmark.url),
          hasLargeIcon: bookmark.icon && bookmark.icon.length > 10000,
          searchText: `${bookmark.title} ${bookmark.description || ''} ${bookmark.url}`.toLowerCase()
        }));
        
      case 'OPTIMIZE_ICONS':
        return data.map((bookmark: any) => {
          const iconSize = bookmark.icon ? bookmark.icon.length : 0;
          return {
            ...bookmark,
            iconSize,
            isLargeIcon: iconSize > 10000
          };
        });
        
      case 'SEARCH_BOOKMARKS':
        const { bookmarks, query, options = {} } = data;
        const searchTerm = query.toLowerCase();
        const results = bookmarks.filter((bookmark: any) => {
          const searchText = `${bookmark.title} ${bookmark.description || ''} ${bookmark.url}`.toLowerCase();
          return searchText.includes(searchTerm);
        });
        return {
          results: results.slice(0, options.limit || 100),
          total: results.length,
          query
        };
        
      default:
        return data;
    }
  }

  private getHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  // 清理资源
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.taskQueue = [];
  }
}

// 创建全局实例
export const workerManager = new WorkerManager();

// 清理函数（在组件卸载时调用）
export function cleanupWorker() {
  workerManager.destroy();
}