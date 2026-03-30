import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
    expires: new Date(0),
  });

  return res;
}
