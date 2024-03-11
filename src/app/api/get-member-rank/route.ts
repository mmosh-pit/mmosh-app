import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const profilenft = searchParams.get("nft");

  if (profilenft === "undefined") {
    return NextResponse.json("", { status: 200 });
  }

  if (!profilenft) {
    return NextResponse.json(
      {
        error: "Invalid Request",
      },
      {
        status: 400,
      },
    );
  }

  const data = await db
    .collection("mmosh-app-profiles")
    .find(
      { profilenft: { $exists: true } },
      {
        projection: {
          _id: 1,
          royalty: 1,
        },
        sort: { royalty: -1 },
      },
    )
    .toArray();

  if (!data) return NextResponse.json("", { status: 200 });

  const result = {
    rank: 0,
  };

  data.forEach((row, index) => {
    if (row.profilenft == profilenft) {
      result.rank = index;
    }
  });

  return NextResponse.json(result, {
    status: 200,
  });
}
