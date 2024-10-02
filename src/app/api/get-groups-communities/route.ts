import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-group-community");

  const result = await collection.find().toArray();

  return NextResponse.json(result);
}
