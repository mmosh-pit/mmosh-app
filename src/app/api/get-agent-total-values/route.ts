import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-activated-agents");

  const { searchParams } = new URL(req.url);

  const param = searchParams.get("key");

  if (!param) return NextResponse.json("", { status: 400 });

  const count = collection.countDocuments({
    agentId: param,
  });

  return {
    subscribers: count,
    offers: 0,
    teams: 0,
  };
}
