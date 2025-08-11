// Web Worker for processing bookmark data
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_BOOKMARKS':
      processBookmarks(data);
      break;
    case 'OPTIMIZE_ICONS':
      optimizeIcons(data);
      break;
    case 'SEARCH_BOOKMARKS':
      searchBookmarks(data);
      break;
    default:
      self.postMessage({ error: 'Unknown task type' });
  }
};

function processBookmarks(bookmarks) {
  try {
    const processed = bookmarks.map(bookmark => ({
      ...bookmark,
      hostname: getHostname(bookmark.url),
      hasLargeIcon: bookmark.icon && bookmark.icon.length > 10000,
      searchText: `${bookmark.title} ${bookmark.description || ''} ${bookmark.url}`.toLowerCase()
    }));
    
    self.postMessage({
      type: 'PROCESS_BOOKMARKS_COMPLETE',
      data: processed
    });
  } catch (error) {
    self.postMessage({
      type: 'PROCESS_BOOKMARKS_ERROR',
      error: error.message
    });
  }
}

function optimizeIcons(bookmarks) {
  try {
    const optimized = bookmarks.map(bookmark => {
      if (!bookmark.icon || !bookmark.icon.startsWith('data:image/')) {
        return bookmark;
      }
      
      // 检查图标大小
      const iconSize = bookmark.icon.length;
      if (iconSize > 50000) { // 50KB
        console.warn('Large icon detected:', iconSize, 'bytes');
        // 这里可以实现图标压缩逻辑
      }
      
      return {
        ...bookmark,
        iconSize,
        isLargeIcon: iconSize > 10000
      };
    });
    
    self.postMessage({
      type: 'OPTIMIZE_ICONS_COMPLETE',
      data: optimized
    });
  } catch (error) {
    self.postMessage({
      type: 'OPTIMIZE_ICONS_ERROR',
      error: error.message
    });
  }
}

function searchBookmarks({ bookmarks, query, options = {} }) {
  try {
    const searchTerm = query.toLowerCase();
    const { fuzzy = false, limit = 100 } = options;
    
    let results = bookmarks.filter(bookmark => {
      const searchText = bookmark.searchText || 
        `${bookmark.title} ${bookmark.description || ''} ${bookmark.url}`.toLowerCase();
      
      if (fuzzy) {
        return fuzzyMatch(searchText, searchTerm);
      } else {
        return searchText.includes(searchTerm);
      }
    });
    
    // 限制结果数量
    if (limit > 0) {
      results = results.slice(0, limit);
    }
    
    self.postMessage({
      type: 'SEARCH_BOOKMARKS_COMPLETE',
      data: {
        results,
        total: results.length,
        query
      }
    });
  } catch (error) {
    self.postMessage({
      type: 'SEARCH_BOOKMARKS_ERROR',
      error: error.message
    });
  }
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function fuzzyMatch(text, pattern) {
  const patternLength = pattern.length;
  const textLength = text.length;
  
  if (patternLength === 0) return true;
  if (patternLength > textLength) return false;
  
  let patternIndex = 0;
  for (let textIndex = 0; textIndex < textLength && patternIndex < patternLength; textIndex++) {
    if (text[textIndex] === pattern[patternIndex]) {
      patternIndex++;
    }
  }
  
  return patternIndex === patternLength;
}