import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const collection = dataService.getCollectionById(id);
    
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Get collection error:", error);
    return NextResponse.json(
      { error: "Failed to get collection" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JSON 文件模式下，更新集合需要手动编辑 JSON 文件
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来更新集合",
        message: "In JSON file mode, please edit data/bookmarks.json directly to update collections"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Update collection error:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JSON 文件模式下，删除集合需要手动编辑 JSON 文件
    return NextResponse.json(
      { 
        error: "JSON 文件模式下，请直接编辑 data/bookmarks.json 文件来删除集合",
        message: "In JSON file mode, please edit data/bookmarks.json directly to delete collections"
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Delete collection error:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}

