import { CommunityAPIResult } from "@/app/models/community";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const communityCollection = db.collection("mmosh-app-community");

  const { searchParams } = new URL(req.url);
  const communitySymbol = searchParams.get("symbol");
  const result = await communityCollection.findOne<CommunityAPIResult>({
    "data.symbol": communitySymbol,
  });

  return NextResponse.json(result?.data, {
    status: 200,
  });
}
