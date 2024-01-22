import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const data = await db
    .collection("mmosh-app-profiles")
    .find(
      {
        profile: {
          $exists: true,
        },
      },
      {
        sort: { points: -1 },
      },
    )
    .toArray();

  if (!data) return NextResponse.json("", { status: 200 });

  const result = {
    totalAccounts: 0,
    totalPoints: 0,
    users: data,
  };

  data.forEach((row) => {
    result.totalPoints += row.points;
  });

  result.totalAccounts = data.length;

  return NextResponse.json(result, {
    status: 200,
  });
}
