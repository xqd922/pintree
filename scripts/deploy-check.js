#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证项目是否准备好部署到 Vercel
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 检查项目部署准备情况...\n');

const checks = [
  {
    name: '检查 package.json',
    check: () => fs.existsSync('package.json'),
    fix: '确保项目根目录有 package.json 文件'
  },
  {
    name: '检查 pnpm-lock.yaml',
    check: () => fs.existsSync('pnpm-lock.yaml'),
    fix: '运行 pnpm install 生成 pnpm-lock.yaml'
  },
  {
    name: '检查数据文件',
    check: () => fs.existsSync('data/bookmarks.json'),
    fix: '确保 data/bookmarks.json 文件存在'
  },
  {
    name: '检查 Next.js 配置',
    check: () => fs.existsSync('next.config.js'),
    fix: '确保 next.config.js 文件存在'
  },
  {
    name: '检查 Vercel 配置',
    check: () => fs.existsSync('vercel.json'),
    fix: '确保 vercel.json 文件存在'
  },
  {
    name: '检查 TypeScript 配置',
    check: () => fs.existsSync('tsconfig.json'),
    fix: '确保 tsconfig.json 文件存在'
  },
  {
    name: '检查数据文件格式',
    check: () => {
      try {
        const data = JSON.parse(fs.readFileSync('data/bookmarks.json', 'utf-8'));
        return data.collections && data.bookmarks && data.settings;
      } catch {
        return false;
      }
    },
    fix: '确保 data/bookmarks.json 包含 collections, bookmarks, settings 字段'
  }
];

let allPassed = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  
  if (!passed) {
    console.log(`   💡 ${fix}\n`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 所有检查通过！项目准备好部署了。');
  console.log('\n📋 部署步骤：');
  console.log('1. 推送代码到 GitHub');
  console.log('2. 在 Vercel 中导入项目');
  console.log('3. 设置环境变量（NEXTAUTH_SECRET 等）');
  console.log('4. 点击部署');
} else {
  console.log('⚠️  发现问题，请修复后再部署。');
  process.exit(1);
}

console.log('\n📖 详细部署指南请查看 VERCEL_DEPLOY.md');