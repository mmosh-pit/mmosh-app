import { google } from "googleapis";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/mongoClient";
export async function GET() {
  const auth = new google.auth.OAuth2();
  const token: any = await db.collection("googleTokens").findOne({});
  auth.setCredentials({ access_token: token.accessToken });

  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  return NextResponse.json(res.data);
}
