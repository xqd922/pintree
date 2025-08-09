"use client";

import { useState, useEffect } from "react";
import { getEnvironmentInfo } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EnvironmentInfo() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const info = getEnvironmentInfo();
    setEnvInfo(info);
    
    // 只在开发环境显示调试信息
    setShowDebug(info.isDevelopment);
  }, []);

  if (!showDebug || !envInfo) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Environment Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">Environment:</span>
          <Badge variant={envInfo.isDevelopment ? "default" : "secondary"}>
            {envInfo.nodeEnv}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs">Local:</span>
          <Badge variant={envInfo.isLocal ? "default" : "destructive"}>
            {envInfo.isLocal ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs">Cloud:</span>
          <Badge variant={envInfo.isCloud ? "default" : "secondary"}>
            {envInfo.isCloud ? "Yes" : "No"}
          </Badge>
        </div>
        
        {envInfo.hostname && (
          <div className="text-xs">
            <span>Hostname: </span>
            <code className="bg-muted px-1 rounded">{envInfo.hostname}</code>
          </div>
        )}
        
        {(envInfo.isVercel || envInfo.isNetlify || envInfo.isRailway) && (
          <div className="flex items-center gap-2">
            <span className="text-xs">Platform:</span>
            {envInfo.isVercel && <Badge variant="outline">Vercel</Badge>}
            {envInfo.isNetlify && <Badge variant="outline">Netlify</Badge>}
            {envInfo.isRailway && <Badge variant="outline">Railway</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}