import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const creator = searchParams.get("creator");
  let match = creator ? { $match: { creator: creator } } : { $match: { } }


  const result = await db
    .collection("mmosh-app-project")
    .aggregate([
     match,
      {
        $lookup: {
          from: "mmosh-app-project-coins",
          localField: "key",
          foreignField: "projectkey",
          as: "coins",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-project-community",
          localField: "key",
          foreignField: "projectkey",
          as: "community",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-project-profiles",
          localField: "key",
          foreignField: "projectkey",
          as: "profiles",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-project-tokenomics",
          localField: "key",
          foreignField: "projectkey",
          as: "tokenomics",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-project-pass",
          localField: "key",
          foreignField: "projectkey",
          as: "pass",
        },
      },
      {
        $project: {
          name: 1,
          symbol: 1,
          desc: 1,
          key: 1,
          image: 1,
          price: 1,
          presalestartdate: 1,
          presaleenddate: 1,
          dexlistingdate: 1,
          presalesupply: 1,
          minpresalesupply: 1,
          coins: "$coins",
          community: "$community",
          profiles: "$profiles",
          tokenomics: "$tokenomics",
          pass: "$pass",
        },
      },
      {$sort: {created_date: -1}},
    ])
    .limit(100)
    .toArray();
  return NextResponse.json(result, { status: 200 });
}
