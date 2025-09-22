import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-staked-history");

  const { wallet } = await req.json();

  const result = await collection.updateMany(
    { "royalty.receiver": wallet },
    { $set: { "royalty.$[elem].isClaimed": true } },
    { arrayFilters: [{ "elem.receiver": wallet }] }
  );
  console.log("----- UPDATE STAKED TOKENS RESULT -----", result);

  return NextResponse.json("", { status: 200 });
}
