"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function BasicSettingsPage() {
  const [settings, setSettings] = useState({
    websiteName: "",
    description: "",
    keywords: "",
    siteUrl: "",
    logoUrl: "",
    faviconUrl: "",
    enableSearch: true,
    theme: "light"
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
        setSettings(data);
      } catch (error) {
        console.error("Load settings error:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="h-full bg-[#f9f9f9]">
      <AdminHeader title="Basic Settings (JSON Mode)" />

      <div className="mx-auto px-4 py-12 bg-[#f9f9f9]">
        <div className="max-w-3xl mx-auto space-y-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              当前运行在 JSON 文件模式下。要修改设置，请直接编辑 <code>data/bookmarks.json</code> 文件中的 <code>settings</code> 部分。
            </AlertDescription>
          </Alert>

          <Card className="border bg-white">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                当前设置
              </CardTitle>
              <CardDescription>
                以下是从 JSON 文件中读取的当前设置（只读模式）
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-2">
                <Label htmlFor="websiteName">网站名称</Label>
                <Input
                  id="websiteName"
                  name="websiteName"
                  value={settings.websiteName}
                  onChange={handleChange}
                  placeholder="网站名称"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">网站描述</Label>
                <Input
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleChange}
                  placeholder="网站描述"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="keywords">关键词</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={settings.keywords}
                  onChange={handleChange}
                  placeholder="关键词，用逗号分隔"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="siteUrl">网站 URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleChange}
                  placeholder="https://your-domain.com"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleChange}
                  placeholder="/logo.png"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  name="faviconUrl"
                  value={settings.faviconUrl}
                  onChange={handleChange}
                  placeholder="/favicon.ico"
                  disabled
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableSearch"
                  name="enableSearch"
                  checked={settings.enableSearch}
                  onChange={handleChange}
                  disabled
                  className="rounded"
                />
                <Label htmlFor="enableSearch">启用搜索功能</Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="theme">主题</Label>
                <Input
                  id="theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                  placeholder="light"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white">
            <CardHeader className="border-b">
              <CardTitle>如何修改设置</CardTitle>
              <CardDescription>
                在 JSON 文件模式下修改设置的步骤
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. 编辑 JSON 文件</h4>
                <p className="text-sm text-muted-foreground">
                  打开 <code>data/bookmarks.json</code> 文件，找到 <code>settings</code> 部分
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">2. 修改设置值</h4>
                <p className="text-sm text-muted-foreground">
                  直接修改对应的设置值，保存文件
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">3. 重启应用</h4>
                <p className="text-sm text-muted-foreground">
                  重启开发服务器以查看更改：<code>npm run dev</code>
                </p>
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