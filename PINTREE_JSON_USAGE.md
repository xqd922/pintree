# 使用 pintree.json 文件

## 🎯 概述

项目现在已经配置为使用 `data/pintree.json` 文件作为数据源。这个文件支持两种格式：

1. **浏览器书签格式**：直接从浏览器导出的 JSON 格式
2. **Pintree 格式**：标准的 Pintree 数据结构

## 📁 当前配置

### 数据文件位置
```
data/pintree.json
```

### 自动格式检测
系统会自动检测文件格式：
- 如果是数组格式且包含 `type` 字段，识别为浏览器书签格式
- 否则识别为 Pintree 标准格式

## 🔄 浏览器书签格式转换

### 支持的浏览器书签结构
```json
[
  {
    "type": "folder",
    "title": "书签栏",
    "children": [
      {
        "type": "folder",
        "title": "工具",
        "children": [
          {
            "type": "link",
            "title": "网站标题",
            "url": "https://example.com",
            "icon": "https://example.com/favicon.ico"
          }
        ]
      }
    ]
  }
]
```

### 自动转换功能
- ✅ 文件夹自动转换为 Pintree 文件夹结构
- ✅ 链接自动转换为书签
- ✅ 支持无限层级嵌套
- ✅ 自动生成图标链接（如果没有提供）
- ✅ 保持原有的层级关系

## 🚀 使用步骤

### 1. 从浏览器导出书签
1. 打开浏览器书签管理器
2. 选择"导出书签"
3. 保存为 HTML 文件

### 2. 转换为 JSON 格式
使用项目提供的导入工具：
```bash
node scripts/import-bookmarks.js bookmarks.html data/pintree.json
```

### 3. 或者直接使用现有的 pintree.json
如果你已经有了 `pintree.json` 文件，直接放在 `data/` 目录下即可。

## 📊 数据结构说明

### 转换后的结构
```json
{
  "collections": [
    {
      "id": "default",
      "name": "我的书签",
      "slug": "my-bookmarks",
      "description": "从浏览器导入的书签",
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
      "name": "工具",
      "icon": "📁",
      "collectionId": "default",
      "parentId": null,
      "sortOrder": 0
    }
  ],
  "bookmarks": [
    {
      "id": "bookmark-1",
      "title": "网站标题",
      "url": "https://example.com",
      "description": "",
      "icon": "https://example.com/favicon.ico",
      "collectionId": "default",
      "folderId": "folder-1",
      "tags": [],
      "isFeatured": false,
      "sortOrder": 0
    }
  ],
  "settings": {
    "websiteName": "Pintree - 我的书签导航",
    "description": "个人书签导航网站",
    "keywords": "书签,导航,工具",
    "siteUrl": "http://localhost:3000",
    "faviconUrl": "/favicon.ico",
    "logoUrl": "/logo.png",
    "enableSearch": true,
    "theme": "light"
  }
}
```

## 🔧 自定义配置

### 修改网站设置
编辑 `data/pintree.json` 中的 `settings` 部分：
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

### 添加新书签
在 `bookmarks` 数组中添加：
```json
{
  "id": "bookmark-new",
  "title": "新网站",
  "url": "https://newsite.com",
  "description": "网站描述",
  "icon": "https://newsite.com/favicon.ico",
  "collectionId": "default",
  "folderId": "folder-1",
  "tags": ["标签1", "标签2"],
  "isFeatured": false,
  "sortOrder": 999
}
```

## ✅ 验证配置

运行检查脚本确保配置正确：
```bash
node scripts/deploy-check.js
```

## 🚀 部署

1. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "Update to use pintree.json data file"
   git push origin main
   ```

2. **Vercel 自动部署**：
   - Vercel 会自动检测到更改并重新部署
   - 确保 `data/pintree.json` 文件已包含在 Git 中

## 🔍 故障排除

### 常见问题

1. **数据不显示**：
   - 检查 `data/pintree.json` 文件是否存在
   - 验证 JSON 格式是否正确
   - 确保文件已提交到 Git

2. **格式错误**：
   - 使用 JSON 验证工具检查文件格式
   - 确保所有字符串都用双引号包围
   - 检查是否有多余的逗号

3. **图标不显示**：
   - 检查图标 URL 是否可访问
   - 使用 `https://www.google.com/s2/favicons?domain=example.com` 作为备用

## 📈 性能优化

- 建议单个集合的书签数量不超过 1000 个
- 文件夹层级不超过 5 层
- 定期清理无效的书签链接

## 🆘 获取帮助

如果遇到问题：
1. 检查控制台错误信息
2. 验证 JSON 文件格式
3. 参考 `VERCEL_DEPLOY.md` 获取部署帮助
4. 查看项目的 GitHub Issues