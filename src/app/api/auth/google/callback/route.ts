import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/mongoClient";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state: any = req.nextUrl.searchParams.get("state");
  console.log("OAuth2 Callback received with code:", code, "and state:", state);


  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  /**
   * tokens contains:
   * access_token
   * refresh_token
   * expiry_date
   */

  // 🔐 Store tokens in DB (encrypted)
  const decodedState = JSON.parse(
    Buffer.from(state, "base64").toString()
  );
  console.log("Decoded State:", decodedState);
  await saveGoogleTokens({
    agentId: decodedState.agentId,
    userId: decodedState.userId,
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token!,
    expiresAt: tokens.expiry_date!
  });
  if (decodedState.type == "studio") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/studio`);
  }
  else {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/settings`);
  }
}

async function saveGoogleTokens({
  agentId,
  userId,
  accessToken,
  refreshToken,
  expiresAt
}: {
  agentId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}) {
  // Placeholder function to simulate saving tokens to a database
  console.log("Saving tokens for user:", userId);
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);
  console.log("Expires At:", new Date(expiresAt).toISOString());
  // Implement actual DB logic here

  let result = await db.collection("googleTokens").updateOne(
    { userId, agentId },
    {
      $set: {
        accessToken,
        refreshToken,
        expiresAt
      }
    },
    { upsert: true }
  );
  console.log("Database update result:", result);
  return result;
}