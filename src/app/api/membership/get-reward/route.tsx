import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const usageCollection = db.collection("mmosh-app-usage");

  const { searchParams } = new URL(req.url);

  const usageInfo = await usageCollection.find({ agentId: searchParams.get("agentId") }).toArray();
  if (usageInfo.length === 0) {
    return NextResponse.json({
      status: false,
      message: "No usage data found.",
      result: 0
    }, { status: 200 });
  }
  return NextResponse.json({
    status: false,
    message: "usage data retrieved successfully.",
    result: usageInfo[0].value
  }, { status: 200 });
}