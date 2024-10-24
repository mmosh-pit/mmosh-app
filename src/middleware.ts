import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  if (
    req.method !== "GET" &&
    !req.url.includes("signup") &&
    !req.url.includes("request-verification") &&
    !req.url.includes("login") &&
    !req.url.includes("onramp-session") &&
    !req.url.includes("forgot-password") &&
    !req.url.includes("reset-password")
  ) {
    const cookie = cookies().get("session")?.value;

    if (!cookie) {
      return NextResponse.json("", { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_MAIN_URL}/api/is-auth`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          // Forward cookie to Route Handler
          cookie: `session=${cookie}`,
        },
      },
    );

    const data = await response.json();

    console.log("We've got a response here: ", data);

    if (!data) {
      return NextResponse.json("", { status: 401 });
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
