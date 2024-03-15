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
  const searchText = searchParams.get("searchText") as string;

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

  if (searchText) {
    searchText.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

    const searchRegex = new RegExp(`\\b${searchText}\\b`, "i");

    filter["$or"] = [
      {
        "profile.username": searchRegex,
      },
      {
        "profile.name": searchRegex,
      },
    ];
  }

  const sortDirectionValue = sortDirection === "asc" ? 1 : -1;

  const data = await db
    .collection("mmosh-app-profiles")
    .find(filter, {
      projection: {
        wallet: 1,
        profile: 1,
        telegram: 1,
        twitter: 1,
        royalty: { $ifNull: ["$royalty", 0] },
        profilenft: { $ifNull: ["$profilenft", null] },
      },
      sort: { [sortValue]: sortDirectionValue, profilenft: -1 },
      skip: Number(skip),
      limit: 10,
    })
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
