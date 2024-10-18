import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-tokens");

  const politicalCollection = db.collection("mmosh-app-project-tokens");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("symbol");

  if (!param) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const token = await collection.findOne({
    symbol: {
      $regex: new RegExp(param, "ig"),
    },
  });

  if (!token) {
    const newToken = await politicalCollection.findOne({
      symbol: {
        $regex: new RegExp(param, "ig"),
      },
    });

    return NextResponse.json(newToken, {
      status: 200,
    });
  }

  return NextResponse.json(token, {
    status: 200,
  });
}
