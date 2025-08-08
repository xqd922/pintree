"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminHeader } from "@/components/admin/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, ExternalLink } from "lucide-react";

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState({
    websiteName: "",
    description: "",
    keywords: "",
    siteUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // 加载设置数据
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }
        const data = await response.json();
        setSettings({
          websiteName: data.websiteName || "",
          description: data.description || "",
          keywords: data.keywords || "",
          siteUrl: data.siteUrl || "",
        });
      } catch (error) {
        console.error("Load settings error:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <div className="h-full bg-[#f9f9f9]">
      <AdminHeader title="SEO Settings (JSON Mode)" />

      <div className="mx-auto px-4 py-12 bg-[#f9f9f9]">
        <div className="max-w-3xl mx-auto space-y-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              当前运行在 JSON 文件模式下。要修改 SEO 设置，请直接编辑 <code>data/bookmarks.json</code> 文件中的 <code>settings</code> 部分。
            </AlertDescription>
          </Alert>

          <Card className="border bg-white">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                当前 SEO 设置
              </CardTitle>
              <CardDescription>
                以下是从 JSON 文件中读取的当前 SEO 设置（只读模式）
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-2">
                <Label htmlFor="websiteName">网站标题</Label>
                <Input
                  id="websiteName"
                  value={settings.websiteName}
                  placeholder="网站标题"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  显示在浏览器标签页和搜索结果中的标题
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">网站描述</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  placeholder="网站描述"
                  disabled
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  显示在搜索结果中的网站描述，建议 150-160 字符
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="keywords">关键词</Label>
                <Input
                  id="keywords"
                  value={settings.keywords}
                  placeholder="关键词1,关键词2,关键词3"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  用逗号分隔的关键词，有助于搜索引擎理解网站内容
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="siteUrl">网站 URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  placeholder="https://your-domain.com"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  网站的完整 URL，用于生成规范链接和 sitemap
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white">
            <CardHeader className="border-b">
              <CardTitle>SEO 优化建议</CardTitle>
              <CardDescription>
                提升网站搜索引擎排名的建议
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">✅ 已优化项目</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• 动态生成页面标题和描述</li>
                  <li>• 响应式设计，移动端友好</li>
                  <li>• 语义化 HTML 结构</li>
                  <li>• 快速加载速度</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">💡 优化建议</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• 定期更新书签内容</li>
                  <li>• 使用描述性的书签标题</li>
                  <li>• 合理组织文件夹结构</li>
                  <li>• 添加相关的标签</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button variant="outline" asChild>
                  <a href="/README-JSON.md" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    查看完整文档
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}