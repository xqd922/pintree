"use client";

import { useState, useEffect } from "react";
import { getEnvironmentInfo } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EnvTestPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    const info = getEnvironmentInfo();
    setEnvInfo(info);
  }, []);

  if (!envInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Test Page</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Node Environment:</label>
              <div className="mt-1">
                <Badge variant={envInfo.isDevelopment ? "default" : "secondary"}>
                  {envInfo.nodeEnv}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Is Development:</label>
              <div className="mt-1">
                <Badge variant={envInfo.isDevelopment ? "default" : "destructive"}>
                  {envInfo.isDevelopment ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Is Local:</label>
              <div className="mt-1">
                <Badge variant={envInfo.isLocal ? "default" : "destructive"}>
                  {envInfo.isLocal ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Is Cloud:</label>
              <div className="mt-1">
                <Badge variant={envInfo.isCloud ? "default" : "secondary"}>
                  {envInfo.isCloud ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>
          
          {envInfo.hostname && (
            <div>
              <label className="text-sm font-medium">Hostname:</label>
              <div className="mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {envInfo.hostname}
                </code>
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium">Platform Detection:</label>
            <div className="mt-1 flex gap-2">
              {envInfo.isVercel && <Badge variant="outline">Vercel</Badge>}
              {envInfo.isNetlify && <Badge variant="outline">Netlify</Badge>}
              {envInfo.isRailway && <Badge variant="outline">Railway</Badge>}
              {!envInfo.isVercel && !envInfo.isNetlify && !envInfo.isRailway && (
                <Badge variant="outline">Unknown/Local</Badge>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Admin Access:</h3>
            <p className="text-sm text-muted-foreground">
              {envInfo.isLocal 
                ? "✅ Admin features are available (local environment detected)"
                : "❌ Admin features are hidden (cloud environment detected)"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}