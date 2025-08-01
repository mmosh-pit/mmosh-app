import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-user-membership-history");
  const usageCollection = db.collection("mmosh-app-usage");

  const { searchParams } = new URL(req.url);

  const membershipInfo = await collection.find({}).sort("-created_Data").toArray();
  const usageInfo = await usageCollection.find({}).toArray();

  if (membershipInfo.length == 0) {
    return NextResponse.json({
      status: false,
      message: "No membership history found.",
      result: {
        history: [],
        inPool: 0,
        tokenUsage: 0,
      }
    }, { status: 200 });
  }
  const result = [];
  let totalInPool = 0;
  let tokenUsage = 0;
  for (let i = 0; i < membershipInfo.length; i++) {
    const element = membershipInfo[i];
    totalInPool += element.price * 60 / 100;
    result.push(element);
  }
  for (let j = 0; j < usageInfo.length; j++) {
    const element = usageInfo[j];
    tokenUsage += element.value;
  }
  return NextResponse.json({
    status: true,
    message: "Membership history retrieved successfully.",
    result: {
      history: result,
      inPool: totalInPool,
      tokenUsage: tokenUsage,
    }
  }, { status: 200 });
}