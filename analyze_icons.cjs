const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('data/pintree.json', 'utf8'));

  function findLinksWithoutIcons(items, path = '') {
    let results = [];
    
    items.forEach((item, index) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`;
      
      if (item.type === 'link') {
        if (!item.icon) {
          results.push({
            path: currentPath,
            title: item.title,
            url: item.url
          });
        }
      } else if (item.type === 'folder' && item.children) {
        results = results.concat(findLinksWithoutIcons(item.children, currentPath + '.children'));
      }
    });
    
    return results;
  }

  const linksWithoutIcons = findLinksWithoutIcons(data);
  console.log('缺少图标的书签数量:', linksWithoutIcons.length);
  console.log('\n前20个缺少图标的书签:');
  linksWithoutIcons.slice(0, 20).forEach((link, i) => {
    console.log(`${i + 1}. ${link.title}`);
    console.log(`   URL: ${link.url}`);
    console.log('');
  });

  // 生成修复后的数据
  function generateIconPath(url) {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;
      
      // 移除 www. 前缀
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      
      // 替换特殊字符
      domain = domain.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      return `icons/${domain}.ico`;
    } catch (e) {
      return null;
    }
  }

  function addMissingIcons(items) {
    return items.map(item => {
      if (item.type === 'link' && !item.icon) {
        const iconPath = generateIconPath(item.url);
        if (iconPath) {
          return { ...item, icon: iconPath };
        }
      } else if (item.type === 'folder' && item.children) {
        return { ...item, children: addMissingIcons(item.children) };
      }
      return item;
    });
  }

  const fixedData = addMissingIcons(data);
  fs.writeFileSync('data/pintree_fixed.json', JSON.stringify(fixedData, null, 2), 'utf8');
  console.log('\n已生成修复后的文件: data/pintree_fixed.json');

} catch (error) {
  console.error('处理文件时出错:', error.message);
}