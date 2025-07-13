import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  if (
    req.method !== "GET" &&
    !req.url.includes("onramp-session") &&
    !req.url.includes("forgot-password") &&
    !req.url.includes("reset-password") &&
    !req.url.includes("inform") &&
    !req.url.includes("document")
  ) {
    const authorization = req.headers.get("authorization");

    console.log("DO I HAVE AUTHORIZATION? ", authorization);

    if (!authorization) {
      return NextResponse.json("", { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/is-auth`,
      {
        headers: {
          Authorization: authorization ?? "",
        },
      },
    );

    const data = await response.json();

    if (!data.isAuth) {
      return NextResponse.json("", { status: 401 });
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/api/:path*"],
};
