import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/is-auth`,
    {
      headers: {
        Authorization: authorization ?? "",
      },
    },
  );

  const data = await response.json();

  if (
    req.method !== "GET" &&
    !req.url.includes("onramp-session") &&
    !req.url.includes("forgot-password") &&
    !req.url.includes("reset-password") &&
    !req.url.includes("inform") &&
    !req.url.includes("document")
  ) {
    if (!authorization) {
      return NextResponse.json("", { status: 401 });
    }

    if (!data?.data?.is_auth) {
      return NextResponse.json("", { status: 401 });
    }
  }

  return NextResponse.next({
    headers: {
      user: data?.data?.user?.ID,
    },
  });
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/api/:path*"],
};
