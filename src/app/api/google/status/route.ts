import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/mongoClient";
import { getGoogleAccountInfo, listEmails } from "@/app/lib/google";
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user");
  const agentId = req.headers.get("agentId") || req.nextUrl.searchParams.get("agentId");

  if (!userId && !agentId) {
    return NextResponse.json({ error: "user or agentId required" }, { status: 400 });
  }

  const query = agentId ? { agentId } : { userId };
  const token = await db.collection("googleTokens").findOne(query);

  if (!token) {
    return NextResponse.json({ error: "No tokens found" }, { status: 404 });
  }

  const accountInfo = await getGoogleAccountInfo({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt,
  });

  return NextResponse.json({ error: null, data: accountInfo });
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user");
  const agentId = req.headers.get("agentId") || req.nextUrl.searchParams.get("agentId");

  if (!userId && !agentId) {
    return NextResponse.json({ error: "user or agentId required" }, { status: 400 });
  }

  const query = agentId ? { agentId } : { userId };

  const result = await db.collection("googleTokens").deleteOne(query);

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "No tokens found to delete" }, { status: 404 });
  }

  return NextResponse.json({ error: null, message: "Tokens removed successfully" });
}
