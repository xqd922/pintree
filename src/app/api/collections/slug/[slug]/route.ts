import { dataService } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const collection = dataService.getCollectionBySlug(slug);

    if (!collection || !collection.isPublic) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Failed to get collection:", error);
    return NextResponse.json(
      { error: "Failed to get collection" },
      { status: 500 }
    );
  }
} 