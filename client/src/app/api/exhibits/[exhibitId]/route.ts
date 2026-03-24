import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ exhibitId: number }>;
  }
) {
  const { exhibitId } = await params;

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendResponse = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/exhibits/${exhibitId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(backendResponse.data);
}
