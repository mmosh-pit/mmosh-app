import { google } from "googleapis";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/mongoClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const token: any = await db.collection("googleTokens").findOne({});

  if (!token?.accessToken) {
    return NextResponse.json(
      { error: "Google access token not found" },
      { status: 401 }
    );
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token.accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  return NextResponse.json(res.data);
}
