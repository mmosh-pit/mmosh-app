import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/mongoClient";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-recent-coins");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("profile");

  const result = await collection.find({ profilenft: param }).toArray();

  return NextResponse.json(result, { status: 200 });
}
