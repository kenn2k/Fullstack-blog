import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendResponse = await fetch(
      `${process.env.BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
