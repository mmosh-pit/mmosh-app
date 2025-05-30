import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

  let match = {$match: {receiver: wallet, status: { $in: [0, 1] }}};
  const connections = await db
    .collection("mmosh-app-connections")
    .aggregate([
     match,
      {
        $lookup: {
          from: "mmosh-users",
          localField: "receiver",
          foreignField: "wallet",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "mmosh-users",
          localField: "sender",
          foreignField: "wallet",
          as: "sender",
        },
      },
      {
        $project: {
          badge: 1,
          status: 1,
          receiver: "$receiver",
          sender: "$sender",
        },
      },
    ])
    .toArray();

    return NextResponse.json(connections, {
       status: 200,
    });
}