import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ exhibitId: number; commentId: number }>;
  }
) {
  const { exhibitId, commentId } = await params;

  const token = req.cookies.get("access_token")?.value;

  const backendResponse = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/exhibits/${exhibitId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(backendResponse.data);
}
