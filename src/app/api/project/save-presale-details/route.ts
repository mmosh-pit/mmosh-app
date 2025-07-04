import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-presale-details");

  const { presaleminimum, presalemaximum, minimumpurchase, maximumpurchase, lookupperiod, startdate } = await req.json();
  const result = await collection.insertOne({
    presaleminimum: presaleminimum,
    presalemaximum: presalemaximum,
    minimumpurchase: minimumpurchase,
    maximumpurchase: maximumpurchase,
    lookupperiod: lookupperiod,
    startdate: startdate,
    created_date: new Date(),
    updated_date: new Date()
  });
  console.log("===== API RESULT CHECK =====", result.insertedId.toString());
  return NextResponse.json({
    id: result.insertedId.toString()
  }, { status: 200 });
}