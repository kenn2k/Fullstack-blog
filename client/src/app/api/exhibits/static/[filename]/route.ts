import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const safeFilename = path.basename(filename);

  if (safeFilename !== filename) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

  const extension = path.extname(safeFilename).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/exhibits/static/${safeFilename}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
