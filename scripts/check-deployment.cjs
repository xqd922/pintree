#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 确保所有必要的文件和配置都正确
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} - 文件不存在`);
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ ${description}: ${dirPath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${dirPath} - 目录不存在`);
    return false;
  }
}

function checkJsonFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${description}: ${filePath} - 文件不存在`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    JSON.parse(content);
    console.log(`✅ ${description}: ${filePath} - JSON 格式正确`);
    return true;
  } catch (error) {
    console.log(`❌ ${description}: ${filePath} - JSON 格式错误: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔍 开始部署前检查...\n');

  let allChecksPass = true;

  // 检查必要的配置文件
  allChecksPass &= checkFile('package.json', '项目配置文件');
  allChecksPass &= checkFile('next.config.js', 'Next.js 配置文件');
  allChecksPass &= checkFile('tailwind.config.ts', 'Tailwind 配置文件');
  allChecksPass &= checkFile('tsconfig.json', 'TypeScript 配置文件');

  console.log('');

  // 检查数据文件
  allChecksPass &= checkDirectory('data', '数据目录');
  allChecksPass &= checkJsonFile('data/bookmarks.json', '书签数据文件');

  console.log('');

  // 检查关键源文件
  allChecksPass &= checkFile('src/lib/data.ts', '数据访问层');
  allChecksPass &= checkFile('src/app/layout.tsx', '根布局文件');
  allChecksPass &= checkFile('src/app/page.tsx', '主页面文件');

  console.log('');

  // 检查 API 路由
  allChecksPass &= checkDirectory('src/app/api', 'API 路由目录');
  allChecksPass &= checkFile('src/app/api/collections/route.ts', '集合 API');
  allChecksPass &= checkFile('src/app/api/bookmarks/route.ts', '书签 API');
  allChecksPass &= checkFile('src/app/api/settings/route.ts', '设置 API');

  console.log('');

  // 检查环境变量示例
  allChecksPass &= checkFile('.env.example', '环境变量示例文件');

  console.log('');

  if (allChecksPass) {
    console.log('🎉 所有检查通过！项目已准备好部署。');
    console.log('');
    console.log('📝 部署步骤:');
    console.log('1. 确保 .env.local 文件包含必要的环境变量');
    console.log('2. 推送代码到 GitHub');
    console.log('3. 在 Vercel 中导入项目');
    console.log('4. 配置环境变量');
    console.log('5. 部署');
    process.exit(0);
  } else {
    console.log('❌ 检查失败！请修复上述问题后再部署。');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}