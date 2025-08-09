import fs from 'fs';
import path from 'path';

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
    name: '我的书签',
    slug: 'my-bookmarks',
    description: '从浏览器导入的书签',
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
  private data: DataStructure;

  constructor() {
    this.data = loadData();
  }

  // 刷新数据
  refresh() {
    this.data = loadData();
  }

  // 获取所有集合
  getCollections(publicOnly = false): Collection[] {
    let collections = this.data.collections;
    if (publicOnly) {
      collections = collections.filter(c => c.isPublic);
    }
    return collections.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // 根据ID获取集合
  getCollectionById(id: string): Collection | null {
    return this.data.collections.find(c => c.id === id) || null;
  }

  // 根据slug获取集合
  getCollectionBySlug(slug: string): Collection | null {
    return this.data.collections.find(c => c.slug === slug) || null;
  }

  // 获取集合的文件夹
  getFoldersByCollection(collectionId: string, parentId?: string | null): Folder[] {
    return this.data.folders
      .filter(f => f.collectionId === collectionId && f.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // 根据ID获取文件夹
  getFolderById(id: string): Folder | null {
    return this.data.folders.find(f => f.id === id) || null;
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

  // 获取书签
  getBookmarks(collectionId: string, folderId?: string | null): Bookmark[] {
    return this.data.bookmarks
      .filter(b => b.collectionId === collectionId && b.folderId === folderId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // 搜索书签
  searchBookmarks(query: string, collectionId?: string): Bookmark[] {
    const searchTerm = query.toLowerCase();
    let bookmarks = this.data.bookmarks;
    
    if (collectionId) {
      bookmarks = bookmarks.filter(b => b.collectionId === collectionId);
    }
    
    return bookmarks.filter(bookmark => 
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.description?.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // 获取集合的书签数量
  getBookmarkCount(collectionId: string): number {
    return this.data.bookmarks.filter(b => b.collectionId === collectionId).length;
  }

  // 获取设置
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  // 获取特定设置
  getSetting(key: keyof SiteSettings): string | boolean {
    return this.data.settings[key];
  }

  // 获取所有书签
  getAllBookmarks(): Bookmark[] {
    return this.data.bookmarks;
  }

  // 获取所有文件夹
  getAllFolders(): Folder[] {
    return this.data.folders;
  }
}

// 创建全局数据服务实例
export const dataService = new DataService();