#!/usr/bin/env node

/**
 * 书签导入工具
 * 将浏览器导出的 HTML 书签文件转换为 Pintree 的 JSON 格式
 * 
 * 使用方法:
 * node scripts/import-bookmarks.js <bookmarks.html> [output.json]
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function parseBookmarksHtml(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  const collections = [];
  const folders = [];
  const bookmarks = [];
  
  let collectionId = 'imported';
  let folderId = 0;
  let bookmarkId = 0;
  
  // 创建默认集合
  collections.push({
    id: collectionId,
    name: '导入的书签',
    slug: 'imported-bookmarks',
    description: '从浏览器导入的书签集合',
    icon: '📚',
    isPublic: true,
    viewStyle: 'grid',
    sortStyle: 'alpha',
    sortOrder: 0
  });
  
  function processFolder(element, parentId = null, level = 0) {
    const dt = element.querySelector('dt');
    if (!dt) return;
    
    const h3 = dt.querySelector('h3');
    if (h3) {
      // 这是一个文件夹
      const folderName = h3.textContent.trim();
      const currentFolderId = `folder-${++folderId}`;
      
      folders.push({
        id: currentFolderId,
        name: folderName,
        icon: '📁',
        collectionId: collectionId,
        parentId: parentId,
        sortOrder: folders.filter(f => f.parentId === parentId).length
      });
      
      // 处理文件夹内的内容
      const dl = element.querySelector('dl');
      if (dl) {
        const children = Array.from(dl.children);
        children.forEach(child => {
          if (child.tagName === 'DT') {
            const link = child.querySelector('a');
            if (link) {
              // 这是一个书签
              const currentBookmarkId = `bookmark-${++bookmarkId}`;
              bookmarks.push({
                id: currentBookmarkId,
                title: link.textContent.trim(),
                url: link.href,
                description: link.getAttribute('description') || '',
                icon: `https://www.google.com/s2/favicons?domain=${new URL(link.href).hostname}`,
                collectionId: collectionId,
                folderId: currentFolderId,
                tags: [],
                isFeatured: false,
                sortOrder: bookmarks.filter(b => b.folderId === currentFolderId).length
              });
            } else {
              // 可能是嵌套文件夹
              processFolder(child, currentFolderId, level + 1);
            }
          }
        });
      }
    } else {
      // 这是一个书签
      const link = dt.querySelector('a');
      if (link) {
        const currentBookmarkId = `bookmark-${++bookmarkId}`;
        bookmarks.push({
          id: currentBookmarkId,
          title: link.textContent.trim(),
          url: link.href,
          description: link.getAttribute('description') || '',
          icon: `https://www.google.com/s2/favicons?domain=${new URL(link.href).hostname}`,
          collectionId: collectionId,
          folderId: parentId,
          tags: [],
          isFeatured: false,
          sortOrder: bookmarks.filter(b => b.folderId === parentId).length
        });
      }
    }
  }
  
  // 查找书签工具栏或书签菜单
  const bookmarkBars = document.querySelectorAll('dl');
  bookmarkBars.forEach(dl => {
    const children = Array.from(dl.children);
    children.forEach(child => {
      if (child.tagName === 'DT') {
        processFolder(child);
      }
    });
  });
  
  return {
    collections,
    folders,
    bookmarks,
    settings: {
      websiteName: "",
      description: "",
      keywords: "",
      siteUrl: "",
      faviconUrl: "/favicon.ico",
      logoUrl: "/logo.png",
      enableSearch: true,
      theme: "light"
    }
  };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('使用方法: node scripts/import-bookmarks.js <bookmarks.html> [output.json]');
    console.log('');
    console.log('示例:');
    console.log('  node scripts/import-bookmarks.js bookmarks.html');
    console.log('  node scripts/import-bookmarks.js bookmarks.html data/my-bookmarks.json');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputFile = args[1] || 'data/bookmarks.json';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`错误: 输入文件 ${inputFile} 不存在`);
    process.exit(1);
  }
  
  try {
    console.log(`正在读取书签文件: ${inputFile}`);
    const htmlContent = fs.readFileSync(inputFile, 'utf-8');
    
    console.log('正在解析书签...');
    const data = parseBookmarksHtml(htmlContent);
    
    console.log(`解析完成:`);
    console.log(`  - 集合: ${data.collections.length}`);
    console.log(`  - 文件夹: ${data.folders.length}`);
    console.log(`  - 书签: ${data.bookmarks.length}`);
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`正在保存到: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('✅ 导入完成!');
    console.log('');
    console.log('下一步:');
    console.log('1. 检查生成的 JSON 文件');
    console.log('2. 根据需要调整集合名称、描述等信息');
    console.log('3. 运行 npm run dev 启动应用');
    
  } catch (error) {
    console.error('导入失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}