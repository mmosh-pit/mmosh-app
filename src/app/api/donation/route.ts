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
    .collection("mmosh-app-donation-profile")
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
        $project: {
          firstname: 1,
          lastname: 1,
          middlename: 1,
          addressone: 1,
          addresstwo: 1,
          city:1,
          state: 1,
          zip: 1,
          wallet: "$wallet"
        },
      },
      {$sort: {created_date: -1}},
    ])
    .limit(100)
    .toArray();
  return NextResponse.json(result, { status: 200 });
}
