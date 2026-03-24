import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  const token = req.cookies.get("access_token")?.value;

  const backendResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/exhibits/post/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(backendResponse.data);
}
