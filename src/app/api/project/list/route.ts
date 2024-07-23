import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const result = await db
    .collection("mmosh-app-project")
    .aggregate([
      {
        $lookup: {
          from: "mmosh-app-project-coins",
          localField: "projectkey",
          foreignField: "key",
          as: "coins",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-project-community",
          localField: "projectkey",
          foreignField: "key",
          as: "community",
        },
      },

      {
        $lookup: {
          from: "mmosh-app-project-profiles",
          localField: "projectkey",
          foreignField: "key",
          as: "profiles",
        },
      },

      {
        $lookup: {
          from: "mmosh-app-project-tokenomics",
          localField: "projectkey",
          foreignField: "key",
          as: "tokenomics",
        },
      },

      {
        $lookup: {
          from: "mmosh-app-project-pass",
          localField: "projectkey",
          foreignField: "key",
          as: "pass",
        },
      },
      {
        $project: {
          coins: "$coins",
          community: "$community",
          profiles: "$profiles",
          tokenomics: "$tokenomics",
          pass: "$pass",
        },
      },
    ])
    .toArray();

  return NextResponse.json(result, { status: 200 });
}
