import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-usage");

  const { agentId, withdrawal } = await req.json();

  await collection.updateOne(
    { agentId: agentId },
    {
      $inc: {
        withdrawal: withdrawal,
      },
    }
  );

  return NextResponse.json("", { status: 200 });
}
