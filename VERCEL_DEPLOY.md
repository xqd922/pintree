# Vercel 部署指南

## 🚀 快速部署步骤

### 1. 准备代码
确保你的代码已经推送到 GitHub 仓库。

### 2. 在 Vercel 中导入项目
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 从 GitHub 导入你的仓库

### 3. 配置构建设置
Vercel 应该自动检测到这是一个 Next.js 项目。项目已经配置了 `vercel.json` 文件来指定使用 pnpm。

如果需要手动设置：
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next` (自动检测)
- **Node.js Version**: 18.x (默认)

### 4. 设置环境变量
在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量
```
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 可选的环境变量
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
CLARITY_ID=your_clarity_id
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 5. 部署
点击 "Deploy" 按钮开始部署。

## 🔧 故障排除

### 问题 1: Function Runtimes 错误
如果遇到 "Function Runtimes must have a valid version" 错误：
- 检查 `vercel.json` 中是否有错误的 `functions` 配置
- 对于 Next.js 项目，通常不需要手动配置函数运行时
- 使用简化的 `vercel.json` 配置

### 问题 2: pnpm 相关错误
如果遇到 pnpm 相关的错误，确保：
- 项目根目录有 `pnpm-lock.yaml` 文件
- `vercel.json` 中正确配置了 `installCommand`
- `.npmrc` 文件存在并配置正确

### 问题 3: 构建失败
如果构建失败，检查：
- 所有依赖是否正确安装
- TypeScript 类型错误
- 环境变量是否正确设置

### 问题 4: 数据文件问题
确保 `data/bookmarks.json` 文件：
- 存在于项目根目录
- JSON 格式正确
- 包含必要的数据结构

### 问题 5: API 路由错误
如果 API 路由不工作：
- 检查 `src/app/api/` 目录结构
- 确保所有 API 文件导出正确的函数
- 检查环境变量配置

## 📝 部署后检查清单

- [ ] 网站首页正常加载
- [ ] 书签数据正确显示
- [ ] 搜索功能正常工作
- [ ] 管理后台可以访问（如果配置了认证）
- [ ] 响应式设计在移动端正常
- [ ] SEO 元数据正确显示

## 🔄 更新部署

当你更新代码后：
1. 推送代码到 GitHub
2. Vercel 会自动重新部署
3. 如果需要更新数据，修改 `data/bookmarks.json` 并推送

## 🌐 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照指示配置 DNS 记录
4. 更新环境变量中的 `NEXTAUTH_URL` 和 `NEXT_PUBLIC_APP_URL`

## 📊 性能优化

部署后可以考虑的优化：
- 启用 Vercel Analytics
- 配置 CDN 缓存策略
- 优化图片资源
- 启用压缩

## 🆘 获取帮助

如果遇到问题：
1. 检查 Vercel 部署日志
2. 查看浏览器控制台错误
3. 参考 [Vercel 文档](https://vercel.com/docs)
4. 检查 [Next.js 部署指南](https://nextjs.org/docs/deployment)