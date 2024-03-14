import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-lineage");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("profile");

  if (!param) {
    return NextResponse.json("Invalid Request", { status: 400 });
  }

  const res = await collection.findOne({
    profile: param,
  });

  return NextResponse.json(res?.lineage, {
    status: 200,
  });
}
