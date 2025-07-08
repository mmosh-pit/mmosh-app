
import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-user-membership");

  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  const hasMembership = await collection.findOne({
    wallet: wallet,
  });

  const membershipData = await collection.findOne({
    wallet: wallet,
    expirydate: { $lt: new Date() }
  });

  if (!membershipData) {
    if(hasMembership) {
       return NextResponse.json("expired", { status: 200 });
    } else {
       return NextResponse.json("na", { status: 200 });
    }
  } else {
    return NextResponse.json("active", { status: 200 });
  }
}