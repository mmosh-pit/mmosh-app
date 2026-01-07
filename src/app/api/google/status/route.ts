import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/mongoClient";
import { getGoogleAccountInfo, listEmails } from "@/app/lib/google";
export async function GET(req: NextRequest) {
    console.log(req.headers.get("user"), "Headers User ID");
    console.log(req.headers, "Headers");
  const userId = req.headers.get("user") || req.nextUrl.searchParams.get("user");
  console.log("Fetching Google OAuth2 status for user:", userId);
  
  const token: any = await db.collection("googleTokens").findOne({userId});
  if (!token) {
    return NextResponse.json({ error: "No tokens found for user" }, { status: 404 });
  }
  console.log("Found tokens for user:", token);
  const accountInfo = await getGoogleAccountInfo({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt
  });
// const accountInfo = null;
//   const emails = await listEmails({
//     accessToken: token.accessToken,
//     refreshToken: token.refreshToken,
//     expiresAt: token.expiresAt,
//   });
  console.log("Fetched account info and emails for user:", userId, accountInfo);

  return NextResponse.json({ error: null, data: accountInfo });
}


export async function DELETE(req: NextRequest) {
  const userId = req.headers.get("user") || req.nextUrl.searchParams.get("user");
  console.log("Removing Google OAuth2 tokens for user:", userId);

  const result = await db.collection("googleTokens").deleteOne({ userId });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "No tokens found to delete" }, { status: 404 });
  }

  console.log("Successfully removed Google OAuth2 tokens for user:", userId);
  return NextResponse.json({ error: null, message: "Tokens removed successfully" });
}