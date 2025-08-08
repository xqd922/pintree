import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    
    const settings = dataService.getSettings();
    
    // 根据组过滤设置（如果需要）
    if (group === 'feature') {
      return NextResponse.json({
        enableSearch: settings.enableSearch
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      { error: "Failed to get settings" },
      { status: 500 }
    );
  }
}