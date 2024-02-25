import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  if (user === "undefined") {
    return NextResponse.json("", { status: 200 });
  }

  if (!user) {
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
    .collection("users")
    .find(
      {},
      {
        projection: {
          _id: 1,
          referredUsers: 1,
          points: 1,
          telegramId: 1,
        },
        sort: { points: -1 },
      },
    )
    .toArray();

  if (!data) return NextResponse.json("", { status: 200 });

  const result = {
    rank: 0,
    points: 0,
  };

  data.forEach((row, index) => {
    if (row.telegramId == Number(user as string)) {
      result.rank = index;
      result.points = row.points;
    }
  });

  return NextResponse.json(result, {
    status: 200,
  });
}
