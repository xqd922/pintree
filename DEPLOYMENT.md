# Pintree JSON 模式部署指南

## 🚀 Vercel 部署（推荐）

### 1. 准备代码
```bash
# 克隆或下载项目
git clone <your-repo>
cd pintree

# 安装依赖
npm install

# 准备数据文件
# 确保 data/bookmarks.json 存在并包含你的书签数据
```

### 2. 推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. 在 Vercel 部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量（可选）：
   ```
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_password
   NEXTAUTH_SECRET=your_secret
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
5. 点击 "Deploy"

### 4. 自定义域名（可选）
在 Vercel 项目设置中添加自定义域名。

## 🌐 其他平台部署

### Netlify
1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 设置环境变量

### Railway
1. 连接 GitHub 仓库
2. 选择 Next.js 模板
3. 设置环境变量
4. 部署

### 自托管服务器

#### 使用 PM2
```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start npm --name "pintree" -- start

# 设置开机自启
pm2 startup
pm2 save
```

#### 使用 Docker
创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t pintree .
docker run -p 3000:3000 pintree
```

## 🔧 环境变量配置

### 必需变量
- `NEXTAUTH_SECRET`: NextAuth 密钥

### 可选变量
- `ADMIN_EMAIL`: 管理员邮箱
- `ADMIN_PASSWORD`: 管理员密码
- `GOOGLE_ANALYTICS_ID`: Google Analytics ID
- `CLARITY_ID`: Microsoft Clarity ID
- `NEXT_PUBLIC_APP_URL`: 网站 URL

## 📁 文件结构检查

部署前确保以下文件存在：
```
├── data/
│   └── bookmarks.json          # 必需：书签数据
├── public/
│   ├── favicon.ico             # 推荐：网站图标
│   └── logo.png                # 推荐：网站 Logo
├── .env.local                  # 可选：环境变量
└── package.json                # 必需：项目配置
```

## 🔍 部署后检查

1. **访问首页**：确保书签正常显示
2. **搜索功能**：测试搜索是否工作
3. **响应式设计**：检查移动端显示
4. **管理后台**：访问 `/admin/collections`（如果配置了认证）
5. **SEO 设置**：检查页面标题和描述

## 🛠️ 故障排除

### 常见问题

#### 1. 书签不显示
- 检查 `data/bookmarks.json` 文件是否存在
- 验证 JSON 格式是否正确
- 确保集合的 `isPublic` 为 `true`

#### 2. 搜索不工作
- 检查 `settings.enableSearch` 是否为 `true`
- 确保书签数据包含标题和描述

#### 3. 管理后台无法访问
- 检查环境变量 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`
- 确保 `NEXTAUTH_SECRET` 已设置

#### 4. 样式问题
- 确保 Tailwind CSS 正确构建
- 检查 `tailwind.config.ts` 配置

### 日志查看

#### Vercel
在 Vercel 控制台的 "Functions" 标签查看日志

#### 自托管
```bash
# PM2 日志
pm2 logs pintree

# Docker 日志
docker logs <container-id>
```

## 📊 性能优化

### 1. 图片优化
- 使用 WebP 格式的 Logo 和图标
- 压缩图片文件大小

### 2. 数据优化
- 限制单个集合的书签数量（建议 < 1000）
- 使用合理的文件夹层级（建议 < 5 层）

### 3. 缓存设置
在 `next.config.js` 中配置缓存：
```javascript
const nextConfig = {
  images: {
    minimumCacheTTL: 86400, // 24小时
  },
};
```

## 🔄 更新部署

### 更新书签数据
1. 修改 `data/bookmarks.json`
2. 提交并推送到 GitHub
3. Vercel 会自动重新部署

### 更新代码
1. 修改代码文件
2. 测试本地运行：`npm run dev`
3. 提交并推送：`git push`
4. 等待自动部署完成

## 📈 监控和分析

### Google Analytics
1. 创建 GA4 属性
2. 获取测量 ID (G-XXXXXXXXXX)
3. 设置环境变量 `GOOGLE_ANALYTICS_ID`

### Microsoft Clarity
1. 创建 Clarity 项目
2. 获取项目 ID
3. 设置环境变量 `CLARITY_ID`

## 🔒 安全建议

1. **环境变量安全**
   - 不要在代码中硬编码密码
   - 使用强密码作为 `NEXTAUTH_SECRET`

2. **访问控制**
   - 管理后台仅用于查看，实际编辑通过 JSON 文件
   - 考虑使用 VPN 或 IP 白名单保护管理后台

3. **HTTPS**
   - 确保生产环境使用 HTTPS
   - Vercel 默认提供 SSL 证书

## 📞 支持

如果遇到部署问题，请：
1. 检查本文档的故障排除部分
2. 查看项目的 GitHub Issues
3. 提交新的 Issue 描述问题