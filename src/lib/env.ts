/**
 * 环境检测工具
 */

// 检查是否为开发环境
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
};

// 检查是否为本地环境（包括开发环境和本地生产构建）
export const isLocalEnvironment = () => {
    // 检查是否为开发环境
    if (isDevelopment()) {
        return true;
    }

    // 检查是否为本地主机
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.endsWith('.local');
    }

    // 服务端检查
    const hostname = process.env.HOSTNAME || process.env.HOST;
    if (hostname) {
        return hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.endsWith('.local');
    }

    // 检查 Vercel 等云平台环境变量
    if (process.env.VERCEL || process.env.NETLIFY || process.env.RAILWAY_ENVIRONMENT) {
        return false;
    }

    // 默认情况下，如果无法确定，在开发模式下返回 true
    return process.env.NODE_ENV !== 'production';
};

// 检查是否为云端部署环境
export const isCloudEnvironment = () => {
    return !isLocalEnvironment();
};

// 获取当前环境信息
export const getEnvironmentInfo = () => {
    return {
        isDevelopment: isDevelopment(),
        isLocal: isLocalEnvironment(),
        isCloud: isCloudEnvironment(),
        nodeEnv: process.env.NODE_ENV,
        hostname: typeof window !== 'undefined' ? window.location.hostname : (process.env.HOSTNAME || process.env.HOST),
        isVercel: !!process.env.VERCEL,
        isNetlify: !!process.env.NETLIFY,
        isRailway: !!process.env.RAILWAY_ENVIRONMENT,
    };
};