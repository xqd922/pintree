# Pintree - JSON 文件模式

这是 Pintree 的简化版本，使用 JSON 文件存储数据，无需数据库。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 准备数据文件

#### 方式一：使用示例数据
项目已包含示例数据文件 `data/bookmarks.json`，可以直接使用。

#### 方式二：从浏览器导入书签
1. 从浏览器导出书签为 HTML 文件
2. 使用导入工具转换：
```bash
node scripts/import-bookmarks.js bookmarks.html data/bookmarks.json
```

#### 方式三：手动创建
复制 `data/bookmarks.json` 并根据需要修改。

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
# 管理员认证（可选，用于访问管理后台）
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password

# 分析代码（可选）
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
CLARITY_ID=your_clarity_id

# NextAuth 密钥
NEXTAUTH_SECRET=your_secret_key
```

### 4. 启动应用

```bash
npm run dev
```

访问 http://localhost:3000 查看书签网站。

## 📁 数据结构

### JSON 文件格式

```json
{
  "collections": [
    {
      "id": "collection-1",
      "name": "我的书签",
      "slug": "my-bookmarks",
      "description": "个人书签集合",
      "icon": "📚",
      "isPublic": true,
      "viewStyle": "grid",
      "sortStyle": "alpha",
      "sortOrder": 0
    }
  ],
  "folders": [
    {
      "id": "folder-1",
      "name": "开发工具",
      "icon": "🛠️",
      "collectionId": "collection-1",
      "parentId": null,
      "sortOrder": 0
    }
  ],
  "bookmarks": [
    {
      "id": "bookmark-1",
      "title": "GitHub",
      "url": "https://github.com",
      "description": "代码托管平台",
      "icon": "https://github.com/favicon.ico",
      "collectionId": "collection-1",
      "folderId": "folder-1",
      "tags": ["开发", "代码"],
      "isFeatured": true,
      "sortOrder": 0
    }
  ],
  "settings": {
    "websiteName": "我的书签导航",
    "description": "个人书签导航网站",
    "keywords": "书签,导航,工具",
    "siteUrl": "https://my-pintree.vercel.app",
    "faviconUrl": "/favicon.ico",
    "logoUrl": "/logo.png",
    "enableSearch": true,
    "theme": "light"
  }
}
```

## 🔧 自定义配置

### 修改网站信息
编辑 `data/bookmarks.json` 中的 `settings` 部分：

```json
{
  "settings": {
    "websiteName": "你的网站名称",
    "description": "网站描述",
    "keywords": "关键词1,关键词2",
    "siteUrl": "https://your-domain.com",
    "faviconUrl": "/your-favicon.ico",
    "logoUrl": "/your-logo.png",
    "enableSearch": true,
    "theme": "light"
  }
}
```

### 添加书签集合
在 `collections` 数组中添加新集合：

```json
{
  "id": "new-collection",
  "name": "新集合",
  "slug": "new-collection",
  "description": "集合描述",
  "icon": "🔖",
  "isPublic": true,
  "viewStyle": "grid",
  "sortStyle": "alpha",
  "sortOrder": 1
}
```

### 添加文件夹
在 `folders` 数组中添加文件夹：

```json
{
  "id": "new-folder",
  "name": "新文件夹",
  "icon": "📁",
  "collectionId": "collection-id",
  "parentId": null,
  "sortOrder": 0
}
```

### 添加书签
在 `bookmarks` 数组中添加书签：

```json
{
  "id": "new-bookmark",
  "title": "网站标题",
  "url": "https://example.com",
  "description": "网站描述",
  "icon": "https://example.com/favicon.ico",
  "collectionId": "collection-id",
  "folderId": "folder-id",
  "tags": ["标签1", "标签2"],
  "isFeatured": false,
  "sortOrder": 0
}
```

## 📦 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量（如果需要）
4. 部署完成

### 其他平台

由于不需要数据库，可以部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- Render
- 自托管服务器

## 🔍 功能特性

### 已支持功能
- ✅ 书签展示和导航
- ✅ 文件夹层级结构
- ✅ 搜索功能
- ✅ 响应式设计
- ✅ SEO 优化
- ✅ 多集合支持

### JSON 模式限制
- ❌ 无法通过 Web 界面添加/编辑书签
- ❌ 无法动态创建集合和文件夹
- ❌ 无访问统计功能
- ❌ 无用户认证（仅管理后台有简单认证）

## 🛠️ 开发

### 项目结构
```
├── data/
│   └── bookmarks.json          # 数据文件
├── scripts/
│   └── import-bookmarks.js     # 书签导入工具
├── src/
│   ├── app/                    # Next.js 应用
│   ├── components/             # React 组件
│   └── lib/
│       └── data.ts             # 数据访问层
└── README-JSON.md              # 本文档
```

### 数据访问
使用 `src/lib/data.ts` 中的 `DataService` 类访问数据：

```typescript
import { dataService } from '@/lib/data';

// 获取所有集合
const collections = dataService.getCollections();

// 搜索书签
const results = dataService.searchBookmarks('关键词');

// 获取文件夹书签
const bookmarks = dataService.getBookmarks('collection-id', 'folder-id');
```

## 📝 注意事项

1. **数据文件位置**: 确保 `data/bookmarks.json` 文件存在且格式正确
2. **图标链接**: 书签图标建议使用在线链接或相对路径
3. **ID 唯一性**: 确保所有 ID 在各自类型中唯一
4. **排序**: `sortOrder` 字段用于控制显示顺序
5. **公开性**: `isPublic` 控制集合是否在前台显示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📄 许可证

MIT License