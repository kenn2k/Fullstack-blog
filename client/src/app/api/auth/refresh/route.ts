import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const backendResponse = await fetch(
    `${process.env.BASE_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  );

  if (!backendResponse.ok) {
    const res = NextResponse.json(
      { message: "Session expired" },
      { status: 401 }
    );
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }

  const { access_token, refresh_token } = await backendResponse.json();
  const res = NextResponse.json({ ok: true });

  res.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
