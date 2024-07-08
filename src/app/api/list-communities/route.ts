import { NextRequest, NextResponse } from "next/server";
import { Document, Filter } from "mongodb";

import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  const communityCollection = db.collection("mmosh-app-community");
  const { searchParams } = new URL(req.url);

  const param = searchParams.get("searchText") as string;

  const projection = {
    "data.name": 1,
    "data.description": 1,
    "data.symbol": 1,
    "data.image": 1,
    "data.tokenAddress": 1,
    "data.username": 1,
  };

  const search: Filter<Document> = {
    completed: {
      $exists: true,
    },
  };

  if (param !== "") {
    search["$or"] = [
      {
        "data.name": {
          $regex: new RegExp(param, "ig"),
        },
      },
      {
        "data.symbol": {
          $regex: new RegExp(param, "ig"),
        },
      },
    ];
  }

  console.log("Searching with filter: ", search);

  const result = await communityCollection
    .find(search, {
      projection,
    })
    .limit(100)
    .toArray();
  return NextResponse.json(result, {
    status: 200,
  });
}
