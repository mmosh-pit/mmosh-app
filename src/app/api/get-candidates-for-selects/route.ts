import { db } from "@/app/lib/mongoClient";
import { Document, Filter } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("candidates");

  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("search") as string;
  const type = searchParams.get("type") as string;

  const filterCondition: Filter<Document> = {
    $and: [
      {
        ORDER: Number(type),
      },
    ],
  };

  if (searchText !== "") {
    filterCondition.$or = [
      {
        REGION: {
          $regex: new RegExp(searchText, "ig"),
        },
      },

      {
        CANDIDATE_NAME: {
          $regex: new RegExp(searchText, "ig"),
        },
      },
    ];
  }

  const candidates = await collection.find(filterCondition, {}).toArray();

  return NextResponse.json(candidates);
}
