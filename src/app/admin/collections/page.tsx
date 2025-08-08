"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('获取集合失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Collections (JSON Mode)" />

      <main className="flex-1 overflow-y-auto p-8 bg-card/50 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            当前运行在 JSON 文件模式下。要修改集合和书签，请直接编辑 <code>data/bookmarks.json</code> 文件。
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                数据文件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                所有书签数据存储在 JSON 文件中
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">文件位置:</p>
                <code className="text-xs bg-muted p-2 rounded block">
                  data/bookmarks.json
                </code>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/README-JSON.md" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  查看文档
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                导入工具
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                从浏览器书签 HTML 文件导入
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">使用命令:</p>
                <code className="text-xs bg-muted p-2 rounded block">
                  node scripts/import-bookmarks.js bookmarks.html
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>当前集合</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">加载中...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{collections.length}</p>
                  <p className="text-sm text-muted-foreground">个集合</p>
                  {collections.map((collection: any) => (
                    <div key={collection.id} className="flex items-center justify-between text-sm">
                      <span>{collection.name}</span>
                      <span className="text-muted-foreground">{collection.totalBookmarks} 个书签</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">1. 编辑数据文件</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  直接编辑 <code>data/bookmarks.json</code> 来添加或修改书签
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 添加新的集合 (collections)</li>
                  <li>• 创建文件夹 (folders)</li>
                  <li>• 添加书签 (bookmarks)</li>
                  <li>• 修改网站设置 (settings)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. 重启应用</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  修改 JSON 文件后，重启开发服务器以查看更改
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  npm run dev
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
