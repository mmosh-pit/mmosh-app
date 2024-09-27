import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  let page:any = searchParams.get("page");
  let limit = 10
  let offset = 0
  if(page) {
    offset = page * limit
  }

  const connectionsAll = await db
  .collection("mmosh-app-connections")
  .find(
    {
      sender_id: wallet,
      status: 1
    }
  )
  .toArray();
  let match = {$match: {sender_id: wallet, status: 1}};
  const data = await db
    .collection("mmosh-app-connections")
    .aggregate([
     match,
      {
        $lookup: {
          from: "mmosh-app-profiles",
          localField: "receiver_id",
          foreignField: "wallet",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-profiles",
          localField: "sender_id",
          foreignField: "wallet",
          as: "sender",
        },
      },
      {
        $project: {
          key: 1,
          created_date: 1,
          receiver: "$receiver",
          sender: "$sender",
        },
      },
      {$sort: {created_date: -1}},
    ])
    .limit(10)
    .skip(offset)
    .toArray();
    return NextResponse.json({
       total: connectionsAll.length,
       data: data
    }, {
       status: 200,
    });
}
