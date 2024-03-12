import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const skip = searchParams.get("skip");
  const sortValue = searchParams.get("sort") as string;
  const sortDirection = searchParams.get("sortDir") as string;
  const memberTypes = searchParams.get("userType") as string;

  if (!skip || !sortValue || !memberTypes) {
    return NextResponse.json("Invalid Payload", { status: 400 });
  }

  const filter: any = {
    profile: {
      $exists: true,
    },
  };

  if (memberTypes !== "all") {
    filter.profilenft = {
      $exists: memberTypes === "members",
    };
  }

  const sortDirectionValue = sortDirection === "asc" ? 1 : -1;

  const data = await db
    .collection("mmosh-app-profiles")
    .find(filter)
    .sort({ [sortValue]: sortDirectionValue })
    .skip(Number(skip))
    .limit(10)
    .toArray();

  const result = {
    totalAccounts: 0,
    totalPoints: 0,
    users: data,
  };

  data.forEach((row) => {
    result.totalPoints += row.telegram.points;
  });

  result.totalAccounts = data.length;

  return NextResponse.json(result, {
    status: 200,
  });
}
