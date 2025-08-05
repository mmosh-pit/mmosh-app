
import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-user-membership-history");

  const {
    wallet,
    membership,
    membershiptype,
    price,
    expirydate,
  } = await req.json();

  await collection.insertOne({
    wallet,
    membership,
    membershiptype,
    price,
    expirydate,
    created_date: new Date(),
    updated_date: new Date(),
  });
  return NextResponse.json("", { status: 200 });

}