import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("candidates");

  const candidates = await collection.find().toArray();

  console.log("Result here! ", candidates);

  return NextResponse.json(candidates);
}
