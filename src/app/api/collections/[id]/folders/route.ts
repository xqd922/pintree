import { dataService, Folder } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const parentId = searchParams.get("parentId");

    let folders;
    if (all) {
      // 获取集合的所有文件夹
      const allFolders = [];
      const getRootFolders = (parentId: string | null = null): Folder[] => {
        const folders = dataService.getFoldersByCollection(id, parentId);
        let result: Folder[] = [];
        for (const folder of folders) {
          result.push(folder);
          result = result.concat(getRootFolders(folder.id));
        }
        return result;
      };
      folders = getRootFolders();
    } else {
      // 获取指定父文件夹下的文件夹
      folders = dataService.getFoldersByCollection(id, parentId || null);
    }

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Failed to get folders:", error);
    return NextResponse.json(
      { error: "Failed to get folders" },
      { status: 500 }
    );
  }
}
