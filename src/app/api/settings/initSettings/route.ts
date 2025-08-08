import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // JSON 文件模式下，设置已经在 JSON 文件中定义，无需初始化
    return NextResponse.json({ 
      message: 'JSON 文件模式下，设置已在 data/bookmarks.json 中定义',
      status: 'success' 
    }, { status: 200 });
  } catch (error) {
    console.error('Settings initialization failed:', error);
    
    return NextResponse.json({ 
      message: 'Settings initialization failed',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
