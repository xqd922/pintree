
import { dataService } from "@/lib/data";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Analytics } from "@/components/analytics/Analytics";
import { Toaster as SonnerToaster } from "sonner";
import type { Metadata, ResolvingMetadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = async (
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  try {
    const settings = dataService.getSettings();
    
    const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      title: settings.websiteName,
      description: settings.description,
      keywords: settings.keywords,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: siteUrl,
      },
      icons: {
        icon: [
          {
            url: settings.faviconUrl || "/favicon/favicon.ico",
            sizes: "32x32",
            type: "image/x-icon",
          },
        ],
        shortcut: "/favicon/favicon.ico",
        apple: "/favicon/favicon.ico",
      },
    };
  } catch (error) {
    console.error("获取设置失败:", error);
    return {
      title: "Pintree - Smart Bookmark Management & Organization Platform",
      description:
        "Organize, manage and share your bookmarks efficiently with Pintree. Features AI-powered organization, custom collections, and seamless bookmark sharing for enhanced productivity.",
      keywords:
        "bookmark manager, bookmark organizer, bookmark collections, bookmark sharing, productivity tools, website organization, link management, bookmark tags, AI bookmarking, digital organization",
      icons: {
        icon: [
          {
            url: "/favicon/favicon.ico",
            sizes: "32x32",
            type: "image/x-icon",
          },
        ],
        shortcut: "/favicon/favicon.ico",
        apple: "/favicon/favicon.ico",
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 在 JSON 模式下，分析代码可以通过环境变量配置
  const analyticsMap = {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
    clarityId: process.env.CLARITY_ID || "",
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
        <SonnerToaster />
      </body>
      <Analytics clarityId={analyticsMap.clarityId} />
      {!!analyticsMap.googleAnalyticsId && <GoogleAnalytics gaId={analyticsMap.googleAnalyticsId} />}
    </html>
  );
}
