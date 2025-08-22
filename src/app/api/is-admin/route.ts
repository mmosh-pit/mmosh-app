import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const usersCollection = db.collection("mmosh-users");
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  const result = await usersCollection.find({ wallet }).toArray();
  if (result.length === 0 || result[0].role === undefined) {
    return NextResponse.json({ result: false }, { status: 200 });
  }
  return NextResponse.json({ result: result[0].role === "wizard" }, { status: 200 });
}