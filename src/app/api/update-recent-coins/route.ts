import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const collection = db.collection("mmosh-app-recent-coins");

  const { profilenft, coin } = await req.json();

  await collection.insertOne({
    profilenft,
    coin,
  });

  return NextResponse.json("", { status: 200 });
}
