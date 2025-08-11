import fs from 'fs';
import path from 'path';
import { PerformanceMonitor, logMemoryUsage } from './performance';
import { iconOptimizer } from './icon-optimizer';

// 数据类型定义
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isPublic: boolean;
  viewStyle: string;
  sortStyle: string;
  sortOrder: number;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  collectionId: string;
  parentId?: string | null;
  sortOrder: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  collectionId: string;
  folderId?: string | null;
  tags: string[];
  isFeatured: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  websiteName: string;
  description: string;
  keywords: string;
  siteUrl: string;
  faviconUrl: string;
  logoUrl: string;
  enableSearch: boolean;
  theme: string;
}

export interface DataStructure {
  collections: Collection[];
  folders: Folder[];
  bookmarks: Bookmark[];
  settings: SiteSettings;
}

// 数据文件路径
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'pintree.json');

// 浏览器书签项目类型
interface BrowserBookmarkItem {
  type: 'folder' | 'link';
  title: string;
  url?: string;
  icon?: string;
  addDate?: number;
  children?: BrowserBookmarkItem[];
}

// 转换浏览器书签格式为 Pintree 格式
function convertBrowserBookmarks(browserData: BrowserBookmarkItem[]): DataStructure {
  const collections: Collection[] = [];
  const folders: Folder[] = [];
  const bookmarks: Bookmark[] = [];
  
  let collectionId = 'default';
  let folderIdCounter = 1;
  let bookmarkIdCounter = 1;
  
  // 创建默认集合
  collections.push({
    id: collectionId,
    name: '书签栏',
    slug: 'me',
    description: '属于自己的书签',
    icon: '📚',
    isPublic: true,
    viewStyle: 'grid',
    sortStyle: 'alpha',
    sortOrder: 0
  });
  
  function processItems(items: BrowserBookmarkItem[], parentId: string | null = null, sortOrder = 0) {
    items.forEach((item, index) => {
      if (item.type === 'folder' && item.children) {
        const folderId = `folder-${folderIdCounter++}`;
        folders.push({
          id: folderId,
          name: item.title,
          icon: '📁',
          collectionId,
          parentId,
          sortOrder: index
        });
        
        // 递归处理子项目
        processItems(item.children, folderId);
      } else if (item.type === 'link' && item.url) {
        bookmarks.push({
          id: `bookmark-${bookmarkIdCounter++}`,
          title: item.title,
          url: item.url,
          description: '',
          icon: item.icon || `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}`,
          collectionId,
          folderId: parentId,
          tags: [],
          isFeatured: false,
          sortOrder: index
        });
      }
    });
  }
  
  // 查找书签栏文件夹并只处理其内容
  const bookmarkBar = browserData.find(item => 
    item.type === 'folder' && 
    (item.title === '书签栏' || item.title === 'Bookmarks bar' || item.title === 'Bookmarks Bar')
  );
  
  if (bookmarkBar && bookmarkBar.children) {
    // 只处理书签栏下的内容
    processItems(bookmarkBar.children);
  } else {
    // 如果没有找到书签栏，处理所有根级别的项目
    processItems(browserData);
  }
  
  return {
    collections,
    folders,
    bookmarks,
    settings: {
      websiteName: "Pintree",
      description: "个人书签导航网站",
      keywords: "书签,导航,工具",
      siteUrl: "https://tree.xqd.pp.ua",
      faviconUrl: "/favicon/favicon.ico",
      logoUrl: "/logo.png",
      enableSearch: true,
      theme: "light"
    }
  };
}

// 读取数据
export function loadData(): DataStructure {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // 如果文件不存在，返回默认数据
      return {
        collections: [],
        folders: [],
        bookmarks: [],
        settings: {
          websiteName: "Pintree",
          description: "书签导航网站",
          keywords: "书签,导航",
          siteUrl: "http://localhost:3000",
          faviconUrl: "/favicon/favicon.ico",
          logoUrl: "/logo.png",
          enableSearch: true,
          theme: "light"
        }
      };
    }

    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const rawData = JSON.parse(fileContent);
    
    // 检查是否是浏览器书签格式
    if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].type) {
      // 转换浏览器书签格式
      return convertBrowserBookmarks(rawData);
    } else {
      // 假设是 Pintree 格式
      return rawData as DataStructure;
    }
  } catch (error) {
    console.error('读取数据文件失败:', error);
    throw new Error('无法加载数据文件');
  }
}

// 保存数据（如果需要动态更新）
export function saveData(data: DataStructure): void {
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存数据文件失败:', error);
    throw new Error('无法保存数据文件');
  }
}

// 数据查询函数
export class DataService {
  private data: DataStructure | null = null;
  private lastModified: number = 0;
  private isLoading: boolean = false;
  
  // 索引缓存
  private bookmarksByCollection: Map<string, Bookmark[]> = new Map();
  private bookmarksByFolder: Map<string, Bookmark[]> = new Map();
  private foldersByCollection: Map<string, Folder[]> = new Map();
  private searchIndex: Map<string, Bookmark[]> = new Map();

  constructor() {
    this.loadDataWithCache();
  }

  // 带缓存的数据加载
  private loadDataWithCache() {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      const stats = fs.statSync(DATA_FILE_PATH);
      const fileModified = stats.mtime.getTime();
      
      // 只有文件更新时才重新加载
      if (!this.data || fileModified > this.lastModified) {
        console.log('📁 Loading data from file...');
        logMemoryUsage('Before loading data');
        
        this.data = PerformanceMonitor.measure('Load JSON data', () => {
          return loadData();
        });
        
        // 重建索引
        PerformanceMonitor.measure('Build indexes', () => {
          this.buildIndexes();
        });
        
        this.lastModified = fileModified;
        logMemoryUsage('After loading data');
        
        // 统计数据量
        if (this.data) {
          console.log('📊 Data loaded:', {
            collections: this.data.collections.length,
            folders: this.data.folders.length,
            bookmarks: this.data.bookmarks.length
          });
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      if (!this.data) {
        this.data = this.getDefaultData();
      }
    } finally {
      this.isLoading = false;
    }
  }

  private getDefaultData(): DataStructure {
    return {
      collections: [],
      folders: [],
      bookmarks: [],
      settings: {
        websiteName: "Pintree",
        description: "书签导航网站",
        keywords: "书签,导航",
        siteUrl: "http://localhost:3000",
        faviconUrl: "/favicon/favicon.ico",
        logoUrl: "/logo.png",
        enableSearch: true,
        theme: "light"
      }
    };
  }

  // 构建索引以提高查询性能
  private buildIndexes() {
    if (!this.data) return;
    
    // 清空现有索引
    this.bookmarksByCollection.clear();
    this.bookmarksByFolder.clear();
    this.foldersByCollection.clear();
    this.searchIndex.clear();
    
    // 按集合分组书签
    this.data.bookmarks.forEach(bookmark => {
      const collectionKey = bookmark.collectionId;
      if (!this.bookmarksByCollection.has(collectionKey)) {
        this.bookmarksByCollection.set(collectionKey, []);
      }
      this.bookmarksByCollection.get(collectionKey)!.push(bookmark);
      
      // 按文件夹分组书签
      const folderKey = `${bookmark.collectionId}:${bookmark.folderId || 'root'}`;
      if (!this.bookmarksByFolder.has(folderKey)) {
        this.bookmarksByFolder.set(folderKey, []);
      }
      this.bookmarksByFolder.get(folderKey)!.push(bookmark);
    });
    
    // 按集合分组文件夹
    this.data.folders.forEach(folder => {
      const key = `${folder.collectionId}:${folder.parentId || 'root'}`;
      if (!this.foldersByCollection.has(key)) {
        this.foldersByCollection.set(key, []);
      }
      this.foldersByCollection.get(key)!.push(folder);
    });
    
    // 对索引进行排序
    this.bookmarksByCollection.forEach(bookmarks => {
      bookmarks.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    
    this.bookmarksByFolder.forEach(bookmarks => {
      bookmarks.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    
    this.foldersByCollection.forEach(folders => {
      folders.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    
    console.log('🔍 Indexes built:', {
      bookmarksByCollection: this.bookmarksByCollection.size,
      bookmarksByFolder: this.bookmarksByFolder.size,
      foldersByCollection: this.foldersByCollection.size
    });
  }

  // 刷新数据
  refresh() {
    this.loadDataWithCache();
  }

  // 确保数据已加载
  private ensureDataLoaded() {
    if (!this.data) {
      this.loadDataWithCache();
    }
    return this.data!;
  }

  // 获取所有集合
  getCollections(publicOnly = false): Collection[] {
    const data = this.ensureDataLoaded();
    let collections = data.collections;
    if (publicOnly) {
      collections = collections.filter(c => c.isPublic);
    }
    return collections.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // 根据ID获取集合
  getCollectionById(id: string): Collection | null {
    const data = this.ensureDataLoaded();
    return data.collections.find(c => c.id === id) || null;
  }

  // 根据slug获取集合
  getCollectionBySlug(slug: string): Collection | null {
    const data = this.ensureDataLoaded();
    return data.collections.find(c => c.slug === slug) || null;
  }

  // 获取集合的文件夹（使用索引优化）
  getFoldersByCollection(collectionId: string, parentId?: string | null): Folder[] {
    this.ensureDataLoaded();
    const key = `${collectionId}:${parentId || 'root'}`;
    return this.foldersByCollection.get(key) || [];
  }

  // 根据ID获取文件夹
  getFolderById(id: string): Folder | null {
    const data = this.ensureDataLoaded();
    return data.folders.find(f => f.id === id) || null;
  }

  // 获取文件夹路径（面包屑）
  getFolderPath(folderId: string): Folder[] {
    const path: Folder[] = [];
    let currentFolder = this.getFolderById(folderId);
    
    while (currentFolder) {
      path.unshift(currentFolder);
      currentFolder = currentFolder.parentId ? this.getFolderById(currentFolder.parentId) : null;
    }
    
    return path;
  }

  // 获取书签（支持分页，使用索引优化）
  getBookmarks(collectionId: string, folderId?: string | null, limit?: number, offset?: number): Bookmark[] {
    this.ensureDataLoaded();
    const key = `${collectionId}:${folderId || 'root'}`;
    let bookmarks = this.bookmarksByFolder.get(key) || [];
    
    // 如果指定了分页参数，则进行分页
    if (limit !== undefined) {
      const start = offset || 0;
      bookmarks = bookmarks.slice(start, start + limit);
    }
    
    // 优化图标（仅在需要时）
    return iconOptimizer.processBookmarkIcons(bookmarks);
  }

  // 获取书签总数（使用索引优化）
  getBookmarksCount(collectionId: string, folderId?: string | null): number {
    this.ensureDataLoaded();
    const key = `${collectionId}:${folderId || 'root'}`;
    return (this.bookmarksByFolder.get(key) || []).length;
  }

  // 搜索书签（支持分页）
  searchBookmarks(query: string, collectionId?: string, limit?: number, offset?: number): { bookmarks: Bookmark[], total: number } {
    const data = this.ensureDataLoaded();
    const searchTerm = query.toLowerCase();
    let bookmarks = data.bookmarks;
    
    if (collectionId) {
      bookmarks = bookmarks.filter(b => b.collectionId === collectionId);
    }
    
    const filteredBookmarks = bookmarks.filter(bookmark => 
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.description?.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    const total = filteredBookmarks.length;
    
    // 如果指定了分页参数，则进行分页
    if (limit !== undefined) {
      const start = offset || 0;
      return {
        bookmarks: filteredBookmarks.slice(start, start + limit),
        total
      };
    }
    
    return {
      bookmarks: filteredBookmarks,
      total
    };
  }

  // 获取集合的书签数量（使用索引优化）
  getBookmarkCount(collectionId: string): number {
    this.ensureDataLoaded();
    return (this.bookmarksByCollection.get(collectionId) || []).length;
  }

  // 获取设置
  getSettings(): SiteSettings {
    const data = this.ensureDataLoaded();
    return data.settings;
  }

  // 获取特定设置
  getSetting(key: keyof SiteSettings): string | boolean {
    const data = this.ensureDataLoaded();
    return data.settings[key];
  }

  // 获取所有书签（支持分页）
  getAllBookmarks(limit?: number, offset?: number): Bookmark[] {
    const data = this.ensureDataLoaded();
    if (limit !== undefined) {
      const start = offset || 0;
      return data.bookmarks.slice(start, start + limit);
    }
    return data.bookmarks;
  }

  // 获取所有文件夹
  getAllFolders(): Folder[] {
    const data = this.ensureDataLoaded();
    return data.folders;
  }
}

// 创建全局数据服务实例
export const dataService = new DataService();