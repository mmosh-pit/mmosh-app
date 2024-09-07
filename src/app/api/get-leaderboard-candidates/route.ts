import { db } from "@/app/lib/mongoClient";
import { Document, Filter } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("candidates");

  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("search") as string;

  const typesParam = searchParams.get("types") as string;

  if (typesParam === "") return NextResponse.json([]);

  const candidateTypes = typesParam.split(",") ?? [];

  const filterCondition: Filter<Document> = {};

  if (searchText !== "") {
    filterCondition.$or = [
      {
        REGION: {
          $regex: new RegExp(searchText, "ig"),
        },
        CANDIDATE_NAME: {
          $regex: new RegExp(searchText, "ig"),
        },
      },
    ];
  }

  if (candidateTypes.length > 0) {
    filterCondition.$and = [
      {
        CANDIDATE_ID: {
          $in: candidateTypes.map((val) => new RegExp(val, "ig")),
        },
      },
    ];
  }

  const candidates = await collection
    .find(filterCondition, {
      limit: 10,
    })
    .toArray();

  return NextResponse.json(candidates);
}
