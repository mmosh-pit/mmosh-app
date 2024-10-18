import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("searchText") as string;
  let match = {$match: {}};
  if(search) {
     match = {
      $match: {
        $or: [
          { name: { $regex: new RegExp(search, "ig") } },
          { symbol: { $regex: new RegExp(search, "ig") } },
          { desc: { $regex: new RegExp(search, "ig") } },
        ],
      },
    }
  }

  const result = await db
    .collection("mmosh-app-donation-history")
    .aggregate([
     match,
      {
        $lookup: {
          from: "mmosh-app-profile",
          localField: "wallet",
          foreignField: "wallet",
          as: "wallet",
        },
    },
     {
        $lookup: {
            from: "mmosh-app-project-coins",
            localField: "token",
            foreignField: "key",
            as: "token",
      },
    },
      {
        $project: {
          amount: 1,
          wallet: "$wallet",
          token: "$token",
        },
      },
      {$sort: {created_date: -1}},
    ])
    .limit(100)
    .toArray();
  return NextResponse.json(result, { status: 200 });
}
