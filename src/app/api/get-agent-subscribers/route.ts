import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-activated-agents");

  const { searchParams } = new URL(req.url);

  const param = searchParams.get("key");

  if (!param) return NextResponse.json("", { status: 400 });

  const results = await collection
    .aggregate([
      { $match: { agentId: param } },
      {
        $lookup: {
          from: "mmosh-users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
    ])
    .toArray();

  return NextResponse.json(results);
}
