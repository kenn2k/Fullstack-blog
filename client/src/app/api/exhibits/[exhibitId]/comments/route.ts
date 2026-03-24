import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ exhibitId: number }> }
) {
  const { exhibitId } = await params;

  const token = req.cookies.get("access_token")?.value;

  const backendResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/exhibits/${exhibitId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(backendResponse.data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ exhibitId: number }> }
) {
  const { exhibitId } = await params;
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json();

  const backendResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/exhibits/${exhibitId}/comments`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(backendResponse.data);
}
