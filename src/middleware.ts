import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 检查是否为本地环境的服务端版本
function isLocalEnvironment(request: NextRequest): boolean {
  const hostname = request.nextUrl.hostname;
  
  // 检查是否为本地主机
  if (hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local')) {
    return true;
  }
  
  // 检查环境变量
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'development') {
    return true;
  }
  
  // 检查云平台环境变量
  if (process.env.VERCEL || process.env.NETLIFY || process.env.RAILWAY_ENVIRONMENT) {
    return false;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否访问管理相关路径
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    // 如果不是本地环境，重定向到首页
    if (!isLocalEnvironment(request)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/api/admin/:path*',
  ],
};