import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-user-membership-history");
  const usageCollection = db.collection("mmosh-app-usage");

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const totalDocuments = await collection.countDocuments();

  const membershipInfo = await collection.find({}).sort({ created_date: -1 }).skip(skip).limit(limit).toArray();

  if (membershipInfo.length == 0) {
    return NextResponse.json({
      status: false,
      message: "No membership history found.",
      result: {
        history: [],
        inPool: 0,
        tokenUsage: 0,
        total: 0
      }
    }, { status: 200 });
  }
  const allPricesCursor = await collection.find({}, { projection: { price: 1 } }).toArray();
  const totalInPool = allPricesCursor.reduce((acc, doc) => acc + ((doc.price || 0) * 60 / 100), 0);
  return NextResponse.json({
    status: true,
    message: "Membership history retrieved successfully.",
    result: {
      history: membershipInfo,
      inPool: totalInPool,
      total: totalDocuments
    }
  }, { status: 200 });
}