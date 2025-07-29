import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-user-membership-history");

  const { searchParams } = new URL(req.url);

  const membershipInfo = await collection.find({}).sort("-created_Data").toArray();

  if (membershipInfo.length == 0) {
    return NextResponse.json({
      status: false,
      message: "No membership history found.",
      result: {
        history: [],
        inPool: 0,
        tokenUsage: 0,
        rewards: 0
      }
    }, { status: 200 });
  }
  const result = [];
  let totalInPool = 0;
  for (let i = 0; i < membershipInfo.length; i++) {
    const element = membershipInfo[i];
    totalInPool += element.price * 60 / 100;
    result.push(element);
  }
  return NextResponse.json({
    status: true,
    message: "Membership history retrieved successfully.",
    result: {
      history: result,
      inPool: totalInPool,
      tokenUsage: 0,
      rewards: 0
    }
  }, { status: 200 });
}